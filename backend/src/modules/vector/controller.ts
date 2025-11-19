import { Context } from "elysia";
import { VectorService } from "./service";

export const VectorController = {
  search: async (
    body: {
      message: string;
      top_k?: number;
    },
    set: Context["set"]
  ) => {
    const results = await VectorService.performSearch(body.message, body.top_k);

    return {
      results,
    };
  },
};
