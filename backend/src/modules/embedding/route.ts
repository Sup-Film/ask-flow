import { Elysia } from "elysia";
import { EmbeddingController } from "./controller";
import { embedDocumentSchema } from "./schema";

// กำหนด Route สำหรับ Embedding
// POST /documents/:id/embed
export const embeddingModule = new Elysia({ prefix: "/documents" }).post(
  "/:id/embed",
  ({ params }) => EmbeddingController.process(params),
  {
    params: embedDocumentSchema,
  }
);
