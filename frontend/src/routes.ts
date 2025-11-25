import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Index Route: หน้าแรกของเว็บ (/)
  index("routes/home.tsx"),

  // Basic Route: หน้าธรรมดา (/data-fetching)
  route("data-fetching", "routes/data-fetching.tsx"),

  // Nested Routes with Layout: การซ้อน Route
  // route() ตัวแรกกำหนด path หลัก (/dashboard) และ layout file
  route("dashboard", "routes/dashboard/layout.tsx", [
    // Index ของ Dashboard (/dashboard) - แสดงผลใน <Outlet /> ของ layout.tsx
    index("routes/dashboard/index.tsx"),

    // Route ย่อย (/dashboard/settings) - แสดงผลใน <Outlet /> ของ layout.tsx
    route("settings", "routes/dashboard/settings.tsx"),
  ]),

  // Dynamic Route: รับค่าพารามิเตอร์จาก URL
  // :id จะถูกส่งไปให้ component ผ่าน useParams()
  // ตัวอย่าง: /users/123, /users/abc
  route("users/:id", "routes/users/user.tsx"),

  // Splat Route (Catch-all): รับค่า path อะไรก็ได้ต่อท้าย
  // * จะแมทช์ทุกอย่างที่ต่อจาก /files/
  // ตัวอย่าง: /files/documents/report.pdf
  route("files/*", "routes/files/$.tsx"),

  // Pathless Layout: Layout ที่ไม่มีผลกับ URL
  // ใช้เมื่อต้องการแชร์ UI (เช่น wrapper) แต่ไม่ต้องการเพิ่ม path ใน URL
  // ตัวอย่าง: เข้า /login แต่ได้ UI จาก _auth/layout.tsx ครอบอยู่
  layout("routes/_auth/layout.tsx", [route("login", "routes/_auth/login.tsx")]),
] satisfies RouteConfig;
