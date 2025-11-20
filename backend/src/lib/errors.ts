export class AppError extends Error {
  constructor(public message: string, public code: number) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 400 Bad Request: ส่งข้อมูลมาผิด
export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}
// 401 Unauthorized: ยังไม่ได้ล็อกอิน
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}
// 404 Not Found: หาไม่เจอ
export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}
// 500 Internal Server Error: ระบบพัง
export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
