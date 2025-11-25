import { Elysia, ParseError, ValidationError } from "elysia";
import { cors } from "@elysiajs/cors";
rateLimit;
import { config } from "./config";
import { globalHooks } from "./lifecycle/hooks";
import { authModule } from "./modules/auth/router";
import { chatModule } from "./modules/chat/router";
import { documentModule } from "./modules/documents/router";
import { vectorModule } from "./modules/vector/router";
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from "./lib/errors";
import { logger } from "./lib/logger";
import { rateLimit } from "elysia-rate-limit";
import { helmet } from "elysia-helmet";

const app = new Elysia()
  .use(cors())
  .use(
    rateLimit({
      duration: 60_000, // หน้าต่างเวลา 1 นาที
      max: 60, // อนุญาต 60 ครั้ง/หน้าต่าง
    })
  )
  .use(helmet())
  .error({
    APP_ERROR: AppError,
    BAD_REQUEST: BadRequestError,
    UNAUTHORIZED: UnauthorizedError,
    RESOURCE_NOT_FOUND: NotFoundError,
    INTERNAL_SERVER_ERROR: InternalServerError,
  })
  .use(globalHooks)
  .use(authModule)
  .use(chatModule)
  .use(documentModule)
  .use(vectorModule)
  .get("/", () => "Hello, World!")
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION" || error instanceof ValidationError) {
      set.status = (error as any)?.status ?? 422;
      return {
        success: false,
        error: "Validation error",
        details: error instanceof ValidationError ? error.all : undefined,
      };
    }

    if ((code as string) === "PARSE" || error instanceof ParseError) {
      set.status = (error as any)?.status ?? 400;
      return {
        success: false,
        error: "Invalid request payload",
      };
    }

    if ((code as string) === "NOT_FOUND") {
      logger.warn(`Route not found`);
      set.status = 404;
      return {
        success: false,
        error: "Route not found",
      };
    }

    if (error instanceof AppError) {
      logger.warn(`AppError: ${error.message}`);

      set.status = error.code;
      return {
        success: false,
        error: error.message,
      };
    }

    if (error instanceof Error) {
      logger.error(`🔥 Unhandled Error: ${error}`, error);
      set.status = 500;
      return {
        success: false,
        error: "Internal Server Error",
        stack: config.NODE_ENV === "development" ? error.stack : undefined,
      };
    }

    logger.error("🔥 Unknown thrown value", { thrown: error });
    set.status = 500;
    return {
      success: false,
      error: "Internal Server Error",
    };
  });

app.listen(config.PORT);
logger.info(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
