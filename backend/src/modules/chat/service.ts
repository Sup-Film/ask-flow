import { ollamaChat } from "../../lib/ollama";
import { VectorService } from "../vector/service";
import { logger } from "../../lib/logger";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const chatPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
      Do not output your internal thought process.
      Provide ONLY the final answer.
      If the answer is not in the context, say "ไม่ทราบข้อมูลในเอกสารครับ".

      Context:
      {context}
    `,
  ],
  ["human", "{question}"],
]);

const chatChain = chatPrompt.pipe(ollamaChat).pipe(new StringOutputParser());

export const ChatService = {
  async stream(message: string, topK: number = 5, set: any) {
    // 1. ค้นหาเนื้อหาที่เกี่ยวข้อง (Context) จาก Vector Database
    // โดยส่งข้อความไปให้ VectorService จัดการ (Embedding + Search)
    const contexts = await VectorService.performSearch(message, topK);
    logger.info("contexts", contexts);

    const context = contexts.join("\n\n");

    // 2. ตั้งค่า Header ตอบกลับเป็นแบบ Event Stream (SSE)
    // เพื่อให้ Client รับข้อมูลทีละส่วนได้ (พิมพ์ตอบทีละตัวอักษร)
    set.headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    };

    // 3. เรียกใช้งาน LangChain Runnable เพื่อตอบกลับแบบ Stream โดยส่ง Context และคำถามไป
    const stream = await chatChain.stream({ context, question: message });

    // 4. ปรับข้อความให้เป็นรูปแบบ SSE ตามมาตรฐาน (prefix ด้วย "data: " และขึ้นบรรทัดใหม่สองครั้ง)
    const readable = stream.toReadableStream();
    const encoder = new TextEncoder();

    return new ReadableStream({
      async start(controller) {
        const reader = readable.getReader();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = typeof value === "string" ? value : String(value ?? "");
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });
  },
};
