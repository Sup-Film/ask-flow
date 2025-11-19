import { t } from "elysia";

export const uploadDocumentSchema = {
  body: t.Object({
    file: t.File({
      error: "Invalid file upload",
    }),
  }),
};

export const embedDocumentSchema = {
  params: t.Object({
    id: t.String(),
  }),
};
