import { ollamaChat } from "../../lib/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { VectorService } from "../vector/service";
import { logger } from "../../lib/logger";

export const ChatService = {
  async stream(message: string, topK: number = 5, set: any) {
    // 1. ค้นหาเนื้อหาที่เกี่ยวข้อง (Context) จาก Vector Database
    // โดยส่งข้อความไปให้ VectorService จัดการ (Embedding + Search)
    const contexts = await VectorService.performSearch(message, topK);
    logger.info("contexts", contexts);
    // 2. สร้าง System Prompt โดยเอาเนื้อหาที่หาเจอ (Context) แปะลงไปด้วย
    // เพื่อให้ AI ใช้ข้อมูลนี้ในการตอบคำถาม
    const systemPrompt = `
      Do not output your internal thought process.
      Provide ONLY the final answer.
      If the answer is not in the context, say "ไม่ทราบข้อมูลในเอกสารครับ".

      Context:
      ${contexts.join("\n\n")}
    `;

    // 3. ตั้งค่า Header ตอบกลับเป็นแบบ Event Stream (SSE)
    // เพื่อให้ Client รับข้อมูลทีละส่วนได้ (พิมพ์ตอบทีละตัวอักษร)
    set.headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    };

    // 4. เรียกใช้งาน OpenAI แบบ Stream โดยส่งทั้ง System Prompt และ User Message ไป
    const stream = await ollamaChat.stream([
      new SystemMessage(systemPrompt),
      new HumanMessage(message),
    ]);

    // แปลงเป็น ReadableStream ให้ Elysia ส่งกลับไปได้เลย
    return new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk.content);
        }
        controller.close();
      },
    });
  },
};
