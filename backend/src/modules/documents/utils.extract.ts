import { PDFParse } from "pdf-parse";
import { logger } from "../../lib/logger";
import { BadRequestError, InternalServerError } from "../../lib/errors";

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
      logger.error("[PDF Extract Error]", { error: err });
      throw new InternalServerError("Failed to extract text from PDF");
    }
  }

  // Case 2: Plain text
  if (normalized.includes("text")) {
    return buffer.toString("utf8").trim();
  }

  // Unsupported MIME
  throw new BadRequestError(`Unsupported file type: ${mime}`);
};
