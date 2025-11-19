import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { config } from "./config";
import { globalHooks } from "./lifecycle/hooks";

const app = new Elysia()
  .use(cors())
  .use(globalHooks) // global lifecycle hooks
  .get("/", () => "Hello, World!")
  .onError(({ code, error }) => {
    console.error("[ERROR]", code, error);
    return { error: error };
  });

app.listen(config.PORT);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
