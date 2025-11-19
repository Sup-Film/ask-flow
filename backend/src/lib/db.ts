import { Pool } from "pg"; // PostgreSQL pool
import { config } from "../config";

export const db = new Pool({
  connectionString: `postgresql://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`,
});

// Test connection
try {
  const client = await db.connect();
  console.log("📦 Connected to Postgres via Pool");
  client.release();
} catch (err) {
  console.error("❌ Could not connect to Postgres", err);
}
