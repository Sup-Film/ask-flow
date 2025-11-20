import { Pool } from "pg"; // PostgreSQL pool
import { config } from "../config";
import { logger } from "./logger";

export const db = new Pool({
  connectionString: `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`,
});

// Test connection
try {
  const client = await db.connect();
  logger.info("📦 Connected to Postgres via Pool");
  client.release();
} catch (err) {
  logger.error("❌ Could not connect to Postgres", { error: err });
}
