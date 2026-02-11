import { z } from "zod/v4";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  SESSION_SECRET: z.string().min(32),
  SITE_URL: z.url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);
