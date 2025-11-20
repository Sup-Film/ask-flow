import { logger } from "../lib/logger";

const requireEnv = (key: string): string => {
  const value = Bun.env[key];
  if (!value) {
    logger.error(`Environment variable ${key} is required but not set.`);
    process.exit(1);
  }
  return value;
};

export const config = {
  NODE_ENV: Bun.env.NODE_ENV || "development",
  LOG_LEVEL: Bun.env.LOG_LEVEL || "info",
  PORT: requireEnv("PORT"),
  POSTGRES_USER: requireEnv("POSTGRES_USER"),
  POSTGRES_PASSWORD: requireEnv("POSTGRES_PASSWORD"),
  POSTGRES_HOST: requireEnv("POSTGRES_HOST"),
  POSTGRES_PORT: requireEnv("POSTGRES_PORT"),
  POSTGRES_DB: requireEnv("POSTGRES_DB"),
  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
};
