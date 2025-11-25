import { db } from "../../lib/db";
import { BadRequestError, UnauthorizedError } from "../../lib/errors";

export const AuthService = {
  async register(body: { name: string; email: string; password: string }) {
    const { name, email, password } = body;

    // ตรวจสอบว่ามีผู้ใช้อยู่แล้วหรือไม่
    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new BadRequestError("Email already exists");
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await Bun.password.hash(password);

    // สร้างผู้ใช้ใหม่
    const result = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    return result.rows[0];
  },

  async login(
    body: { email: string; password: string },
    jwt: any,
    refreshJwt: any
  ) {
    const { email, password } = body;

    // ค้นหาผู้ใช้
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const user = result.rows[0];

    // ตรวจสอบรหัสผ่าน
    const isMatch = await Bun.password.verify(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // สร้าง Token
    const accessToken = await jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    const refreshToken = await refreshJwt.sign({
      id: user.id,
    });

    // บันทึก Refresh Token
    await db.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    };
  },

  async refresh(refreshToken: string, jwt: any, refreshJwt: any) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is required");
    }

    // ตรวจสอบ Token
    const payload = await refreshJwt.verify(refreshToken);
    if (!payload) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    // ตรวจสอบว่า Token ตรงกับในฐานข้อมูลหรือไม่
    const result = await db.query(
      "SELECT * FROM users WHERE id = $1 AND refresh_token = $2",
      [payload.id, refreshToken]
    );

    if (result.rows.length === 0) {
      // ตรวจสอบการใช้ Token ซ้ำ หรือ Token ไม่ถูกต้อง/หมดอายุ
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = result.rows[0];

    // สร้าง Token ใหม่
    const newAccessToken = await jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    const newRefreshToken = await refreshJwt.sign({
      id: user.id,
    });

    // อัปเดต Refresh Token
    await db.query("UPDATE users SET refresh_token = $1 WHERE id = $2", [
      newRefreshToken,
      user.id,
    ]);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(userId: string) {
    await db.query("UPDATE users SET refresh_token = NULL WHERE id = $1", [
      userId,
    ]);
  },
};
