import { db } from "../../lib/db";
import type { DocumentRecord } from "./model";
import { extractText } from "./utils.extract";

export const DocumentService = {
  async upload(file: File): Promise<DocumentRecord> {
    // Convert File to Buffer เพื่อให้ runtime สามารถนำไปประมวลผลได้
    // arrayBuffer -> { byteLength: 1024, … }
    // Buffer.from -> <Buffer 24 50 44 46 ... >
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract text content from the file
    const text = await extractText(buffer, file.type);

    const res = await db.query<DocumentRecord>(
      `
      INSERT INTO documents (name, type, content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [file.name, file.type, text]
    );
    // Return the inserted document record
    return res.rows[0];
  },

  async getAll(): Promise<DocumentRecord[]> {
    const result = await db.query(
      `
      SELECT * FROM documents ORDER BY created_at DESC
      `
    );
    return result.rows;
  },

  async getDetail(id: string): Promise<DocumentRecord | null> {
    const result = await db.query(`SELECT * FROM documents WHERE id = $1`, [
      id,
    ]);
    return result.rows[0];
  },
};
