import Elysia from "elysia";

export const globalHooks = new Elysia()
  .onBeforeHandle(({ request }) => {
    console.log(`[REQUEST] ${request.method} ${request.url}`);
  })
  .onAfterHandle(({ request }) => {
    console.log(`[RESPONSE] ${request.method} ${request.url}`);
  })
  .onError(({ code, error }) => {
    console.error("[GLOBAL ERROR]", code, error);
  });
