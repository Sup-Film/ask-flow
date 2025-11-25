import { t } from "elysia";

export const registerSchema = t.Object({
  name: t.String(),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
});

export const loginSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
});

export const refreshSchema = t.Cookie({
  refresh_token: t.String(),
});
