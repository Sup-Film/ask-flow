import { PDFParse } from "pdf-parse";

export const extractText = async (
  buffer: Buffer,
  mime: string
): Promise<string> => {
  // Normalize MIME (บาง browser ให้ pdf = application/octet-stream)
  const normalized = mime.toLowerCase();

  // Case 1: PDF
  if (normalized.includes("pdf")) {
    let parser: PDFParse | undefined;
    try {
      parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      return result.text.trim();
    } catch (err) {
      console.error("[PDF Extract Error]", err);
      throw new Error("Failed to extract text from PDF");
    } finally {
      await parser?.destroy();
    }
  }

  // Case 2: Plain text
  if (normalized.includes("text")) {
    return buffer.toString("utf8").trim();
  }

  // Unsupported MIME
  throw new Error(`Unsupported file type: ${mime}`);
};
