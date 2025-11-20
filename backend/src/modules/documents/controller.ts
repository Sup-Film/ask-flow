import { Context } from "elysia";
import { DocumentService } from "./service";
import { EmbeddingService } from "../embedding/service";

export const DocumentController = {
  upload: async (body: { file: File }) => {
    return await DocumentService.upload(body.file);
  },

  embed: async (params: { id: string }) => {
    return await EmbeddingService.process(params.id);
  },

  list: async () => {
    return DocumentService.getAll();
  },

  detail: async (params: { id: string }, set: Context["set"]) => {
    const doc = await DocumentService.getDetail(params.id);

    if (!doc) {
      set.status = 404;
      return { error: "Document not found" };
    }

    return doc;
  },
};
