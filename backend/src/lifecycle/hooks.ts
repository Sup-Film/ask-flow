import Elysia from "elysia";
import { logger } from "../lib/logger";

export const globalHooks = (app: Elysia) =>
  app
    .derive(() => {
      return {
        requestStartTime: Date.now(),
      };
    })
    .onBeforeHandle(({ request }) => {
      logger.info(`[REQUEST] ${request.method} ${request.url}`);
    })
    .onAfterHandle(({ request, set, requestStartTime }) => {
      const duration = Date.now() - requestStartTime;
      logger.info(
        `[RESPONSE] ${request.method} ${request.url} ${set.status} - ${duration}ms`
      );
    });
