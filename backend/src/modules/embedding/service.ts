import { db } from "../../lib/db";
import { ollamaEmbeddings } from "../../lib/ollama";
import { ChunkService } from "../chunk/service";
import { BadRequestError, NotFoundError } from "../../lib/errors";
import type { EmbedResult } from "./model";

export const EmbeddingService = {
  async process(documentId: string): Promise<EmbedResult> {
    // 1. ดึงข้อมูลเอกสารจาก Database ตาม ID
    const doc = await db.query(`SELECT content FROM documents WHERE id = $1`, [
      documentId,
    ]);

    if (doc.rows.length === 0) throw new NotFoundError("Document not found");

    const content = doc.rows[0].content ?? "";
    if (!content.trim().length)
      throw new BadRequestError("Document content empty");

    // 2. แบ่งข้อความยาวๆ เป็นชิ้นย่อยๆ (Chunks) เพื่อให้ส่งเข้า OpenAI ได้
    const chunks = ChunkService.chunk(content);

    // 3. ✨ ทำ Embedding ให้เสร็จก่อน (อยู่นอก Transaction)
    // ทำแบบ sequential เพื่อลดโอกาสชน rate limit และควบคุมลำดับ
    // จุดสำคัญคือคำนวณหมดก่อนเปิด DB Connection
    const chunksWithVectors: { text: string; vector: number[] }[] = [];

    // Use Ollama to embed documents in batch (or sequentially if needed, but embedDocuments handles it)
    const vectors = await ollamaEmbeddings.embedDocuments(chunks);

    for (let i = 0; i < chunks.length; i++) {
      chunksWithVectors.push({
        text: chunks[i],
        vector: vectors[i],
      });
    }

    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // ลบของเดิม
      await client.query(`DELETE FROM chunks WHERE document_id = $1`, [
        documentId,
      ]);

      for (const item of chunksWithVectors) {
        await client.query(
          `
          INSERT INTO chunks (document_id, text, embedding)
          VALUES ($1, $2, $3::vector)
          `,
          [documentId, item.text, `[${item.vector.join(",")}]`]
        );
      }
      await client.query(
        `UPDATE documents SET status='embedded' WHERE id = $1`,
        [documentId]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }

    return {
      documentId,
      totalChunks: chunks.length,
      status: "embedded",
    };
  },
};
