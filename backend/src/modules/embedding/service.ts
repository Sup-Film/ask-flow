import { db } from "../../lib/db";
import { openai } from "../../lib/openai";
import { ChunkService } from "../chunk/service";
import type { EmbedResult } from "./model";

export const EmbeddingService = {
  async process(documentId: string): Promise<EmbedResult> {
    // 1. ดึงข้อมูลเอกสารจาก Database ตาม ID
    const doc = await db.query(`SELECT content FROM documents WHERE id = $1`, [
      documentId,
    ]);

    if (doc.rows.length === 0) throw new Error("Document not found");

    const content = doc.rows[0].content ?? "";
    if (!content.trim().length) throw new Error("Document content empty");

    // 2. แบ่งข้อความยาวๆ เป็นชิ้นย่อยๆ (Chunks) เพื่อให้ส่งเข้า OpenAI ได้
    const chunks = ChunkService.chunk(content);

    for (const chunk of chunks) {
      // 3. ส่งแต่ละ Chunk ไปแปลงเป็น Vector (Embedding) ผ่าน OpenAI
      const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      });

      const vector = embedding.data[0].embedding;

      // 4. บันทึก Chunk และ Vector ลงในตาราง chunks
      // เพื่อเอาไว้ค้นหาทีหลัง (Vector Search)
      await db.query(
        `
        INSERT INTO chunks (document_id, text, embedding)
        VALUES ($1, $2, $3)
        `,
        [documentId, chunk, JSON.stringify(vector)]
      );
    }

    // 5. อัปเดตสถานะเอกสารว่าทำ Embedding เสร็จแล้ว
    await db.query(`UPDATE documents SET status='embedded' WHERE id = $1`, [
      documentId,
    ]);

    return {
      documentId,
      totalChunks: chunks.length,
      status: "embedded",
    };
  },
};
