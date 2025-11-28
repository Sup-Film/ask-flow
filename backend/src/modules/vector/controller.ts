import { Context } from "elysia";
import { VectorService } from "./service";

export const VectorController = {
  search: async (
    body: {
      message: string;
    },
    set: Context["set"]
  ) => {
    const results = await VectorService.performSearch(body.message);

    return {
      results,
    };
  },
};
