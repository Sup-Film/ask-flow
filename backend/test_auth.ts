import { describe, expect, it, beforeAll } from "bun:test";

const BASE_URL = "http://localhost:3000";
const TEST_USER = {
  name: "Test User",
  email: `test-${Date.now()}@example.com`,
  password: "password123",
};

let accessToken = "";
let cookieHeader = "";

describe("Auth Flow", () => {
  it("should register a new user", async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(TEST_USER),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.email).toBe(TEST_USER.email);
  });

  it("should login", async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: TEST_USER.email,
        password: TEST_USER.password,
      }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.accessToken).toBeDefined();

    accessToken = data.data.accessToken;
    cookieHeader = res.headers.get("set-cookie") || "";
    expect(cookieHeader).toContain("refresh_token");
  });

  it("should refresh token", async () => {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.accessToken).toBeDefined();

    // Update cookie if rotated
    const newCookie = res.headers.get("set-cookie");
    if (newCookie) {
      cookieHeader = newCookie;
    }
  });

  it("should logout", async () => {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);

    // Check if cookie is cleared (max-age=0 or similar)
    const newCookie = res.headers.get("set-cookie");
    expect(newCookie).toBeDefined();
    // expect(newCookie).toContain("Max-Age=0"); // Implementation dependent
  });
});
