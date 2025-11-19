import { t } from "elysia";

export const uploadDocumentSchema = t.Object({
  file: t.File({
    error: "Invalid file upload",
  }),
});

export const embedDocumentSchema = t.Object({
  id: t.String(),
});
