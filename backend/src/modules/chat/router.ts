import { Elysia, t } from "elysia";
import { ChatController } from "./controller";

export const chatModule = new Elysia({ prefix: "/chat" }).post(
  "/stream",
  ({ body, set }) => ChatController.stream(body, set),
  {
    body: t.Object({
      message: t.String(),
      top_k: t.Optional(t.Number()),
    }),
  }
);
