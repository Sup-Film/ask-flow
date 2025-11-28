/**
 * ค่า K (ในที่นี้คือ topK) ย่อมาจาก "Top K Nearest Neighbors" ครับ
 * แปลง่ายๆ คือ "จำนวนผลลัพธ์ที่ใกล้เคียงที่สุดที่เราต้องการดึงออกมา" ครับ
 *
 * ตัวอย่างให้เห็นภาพ_
 * สมมติเรามีเอกสารใน Database 1,000 ชิ้น และเราถามคำถามว่า "วิธีการลาป่วยทำยังไง?"
 *
 * ถ้า K = 1: ระบบจะหาเอกสารที่เนื้อหาตรงกับคำถามที่สุดมา แค่ 1 อัน
 * ถ้า K = 3: ระบบจะหาเอกสารที่ตรงที่สุดมา 3 อันดับแรก (เช่น กฎการลาป่วย, แบบฟอร์มลา, เบอร์โทร HR)
 * ถ้า K = 5: ก็จะดึงมา 5 อันดับแรก
 * ทำไมต้องกำหนด K?
 * เพราะเวลาเราส่งข้อมูลให้ AI (ChatGPT) ช่วยตอบ เราส่งเอกสารทั้งหมด 1,000 ชิ้นไปให้มันอ่านไม่ได้ (มันเกิน Limit และเปลืองเงิน) เราเลยต้องคัดเฉพาะ "เนื้อหาที่เกี่ยวข้องที่สุด K อันดับแรก" ส่งไปให้ AI อ่านเพื่อใช้ตอบคำถามเราครับ

  สรุป: K คือ จำนวนเอกสารที่เราจะหยิบไปให้ AI อ่าน นั่นเองครับ
 */

import { db } from "../../lib/db";
import { ollamaEmbeddings } from "../../lib/ollama";

export const VectorService = {
  async performSearch(query: string, topK: number = 5): Promise<string[]> {
    // 1. แปลงคำถามเป็น Vector (Embedding) ผ่าน OpenAI
    const queryVector = await ollamaEmbeddings.embedQuery(query);
    const vectorLiteral = `[${queryVector.join(",")}]`;

    // 2. ค้นหา Chunks ที่มี Vector ใกล้เคียงกับคำถามมากที่สุด
    // ใช้ Operator <=> (Cosine Distance) ของ pgvector
    const { rows } = await db.query<{ text: string }>(
      `
        SELECT text
        FROM chunks
        ORDER BY embedding <=> $1::vector
        LIMIT $2
      `,
      [vectorLiteral, topK]
    );

    return rows.map((r) => r.text);
  },
};
