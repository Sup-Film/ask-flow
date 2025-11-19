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

  detail: async (params: { id: string }) => {
    return DocumentService.getDetail(params.id);
  },
};
