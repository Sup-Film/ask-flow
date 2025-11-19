import { t } from "elysia";

export const chatRequestSchema = t.Object({
  message: t.String(),
  top_k: t.Optional(t.Number()),
});
