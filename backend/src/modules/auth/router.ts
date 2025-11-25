import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";
import { config } from "../../config";
import { AuthService } from "./service";
import { loginSchema, registerSchema, refreshSchema } from "./schema";

export const authModule = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: config.JWT_SECRET,
      exp: "15m", // Access Token หมดอายุใน 15 นาที
    })
  )
  .use(
    jwt({
      name: "refreshJwt",
      secret: config.JWT_REFRESH_SECRET,
      exp: "7d", // Refresh Token หมดอายุใน 7 วัน
    })
  )
  .use(cookie())
  .post(
    "/register",
    async ({ body }) => {
      const user = await AuthService.register(body);
      return { success: true, data: user };
    },
    {
      body: registerSchema,
      detail: { tags: ["Auth"] },
    }
  )
  .post(
    "/login",
    async ({ body, jwt, refreshJwt, cookie: { refresh_token } }) => {
      const { user, accessToken, refreshToken } = await AuthService.login(
        body,
        jwt,
        refreshJwt
      );

      // ตั้งค่า Refresh Token ใน Cookie
      refresh_token.set({
        value: refreshToken,
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        path: "/auth/refresh", // จำกัดขอบเขต
        maxAge: 7 * 86400, // 7 วัน
      });

      return {
        success: true,
        data: {
          user,
          accessToken,
        },
      };
    },
    {
      body: loginSchema,
      detail: { tags: ["Auth"] },
    }
  )
  .post(
    "/refresh",
    async ({ jwt, refreshJwt, cookie: { refresh_token } }) => {
      const { accessToken, refreshToken } = await AuthService.refresh(
        refresh_token.value,
        jwt,
        refreshJwt
      );

      // หมุนเวียน Refresh Token
      refresh_token.set({
        value: refreshToken,
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        path: "/auth/refresh",
        maxAge: 7 * 86400,
      });

      return {
        success: true,
        data: {
          accessToken,
        },
      };
    },
    {
      cookie: refreshSchema,
      detail: { tags: ["Auth"] },
    }
  )
  .post(
    "/logout",
    async ({ refreshJwt, cookie: { refresh_token } }) => {
      if (refresh_token.value) {
        try {
          const payload = await refreshJwt.verify(String(refresh_token.value));
          if (payload && payload.id) {
            await AuthService.logout(String(payload.id));
          }
        } catch (error) {
          // ข้ามกรณี Token ไม่ถูกต้องระหว่างออกจากระบบ
        }
        refresh_token.remove();
      }
      return { success: true };
    },
    {
      detail: { tags: ["Auth"] },
    }
  );
