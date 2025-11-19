const requireEnv = (key: string): string => {
  const value = Bun.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set.`);
  }
  return value;
};

export const config = {
  PORT: requireEnv("PORT"),
  POSTGRES_USER: requireEnv("POSTGRES_USER"),
  POSTGRES_PASSWORD: requireEnv("POSTGRES_PASSWORD"),
  POSTGRES_HOST: requireEnv("POSTGRES_HOST"),
  POSTGRES_PORT: requireEnv("POSTGRES_PORT"),
  POSTGRES_DB: requireEnv("POSTGRES_DB"),
  OPENAI_API_KEY: requireEnv("OPENAI_API_KEY"),
};
