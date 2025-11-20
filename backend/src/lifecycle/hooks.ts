import Elysia from "elysia";
import { logger } from "../lib/logger";

export const globalHooks = new Elysia()
  .onBeforeHandle(({ request }) => {
    logger.info(`[REQUEST] ${request.method} ${request.url}`);
  })
  .onAfterHandle(({ request }) => {
    logger.info(`[RESPONSE] ${request.method} ${request.url}`);
  });
