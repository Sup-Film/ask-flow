import { openai } from "../../lib/openai";
import { VectorService } from "../vector/service";

export const ChatService = {
  async stream(message: string, topK: number, set: any) {
    // 1. ค้นหาเนื้อหาที่เกี่ยวข้อง (Context) จาก Vector Database
    // โดยส่งข้อความไปให้ VectorService จัดการ (Embedding + Search)
    const contexts = await VectorService.performSearch(message, topK);

    // 2. สร้าง System Prompt โดยเอาเนื้อหาที่หาเจอ (Context) แปะลงไปด้วย
    // เพื่อให้ AI ใช้ข้อมูลนี้ในการตอบคำถาม
    const systemPrompt = `
      You are a helpful AI assistant. Use the following context to answer the user's question.
      If the answer is not in the context, say you don't know.

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
    return openai.chat.completions
      .stream({
        model: "gpt-4.1", // User confirmed this model exists
        stream: true,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      })
      .toReadableStream(); // แปลงเป็น ReadableStream ให้ Elysia ส่งกลับไปได้เลย
  },
};
