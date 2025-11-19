import { Elysia } from "elysia";
import { DocumentController } from "./controller";
import {
  uploadDocumentSchema,
  embedDocumentSchema,
} from "../../schemas/documents.schema";

export const DocumentRouter = new Elysia({ prefix: "/documents" })
  .post(
    "/upload",
    ({ body }) => DocumentController.upload(body),
    uploadDocumentSchema
  )
  .post(
    "/:id/embed",
    ({ params }) => DocumentController.embed(params),
    embedDocumentSchema
  )
  .get("/", () => DocumentController.list())
  .get("/:id", ({ params }) => DocumentController.detail(params));
