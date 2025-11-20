import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { config } from "./config";
import { globalHooks } from "./lifecycle/hooks";
import { chatModule } from "./modules/chat/router";
import { documentModule } from "./modules/documents/router";
import { vectorModule } from "./modules/vector/router";

const app = new Elysia()
  .use(cors())
  .use(globalHooks) // global lifecycle hooks
  .use(chatModule)
  .use(documentModule)
  .use(vectorModule)
  .get("/", () => "Hello, World!")
  .onError(({ code, error }) => {
    console.error("[ERROR]", code, error);
    return { error: error };
  });

app.listen(config.PORT);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
