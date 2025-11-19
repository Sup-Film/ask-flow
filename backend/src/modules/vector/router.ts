import Elysia from "elysia";
import { VectorController } from "./controller";
import { chatRequestSchema } from "./schema";

export const vectorModule = new Elysia({ prefix: "/vector" }).post(
  "/",
  async (ctx) => {
    return VectorController.search(ctx.body, ctx.set);
  },
  {
    body: chatRequestSchema,
  }
);
