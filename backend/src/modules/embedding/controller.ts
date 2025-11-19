import { EmbeddingService } from "./service";

export const EmbeddingController = {
  // รับ Request จาก Route แล้วส่งต่อให้ Service ทำงาน
  // (Controller ไม่ควรมี Logic ซับซ้อน)
  process: async (params: { id: string }) => {
    return EmbeddingService.process(params.id);
  },
};
