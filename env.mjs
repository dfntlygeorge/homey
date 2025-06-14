import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    HOSTNAME: z.string().optional(), // optional since sometimes not always present
    PORT: z.coerce.number().optional(), // convert from string to number if present
  },

  client: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_AWS_S3_REGION: z.string(),
    NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID: z.string(),
    NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY: z.string(),
    NEXT_PUBLIC_AWS_S3_BUCKET_NAME: z.string(),
    NEXT_PUBLIC_MAPTILER_API_KEY: z.string(),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    HOSTNAME: process.env.HOSTNAME,
    PORT: process.env.PORT,

    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AWS_S3_REGION: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID:
      process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
    NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY:
      process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
    NEXT_PUBLIC_AWS_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    NEXT_PUBLIC_MAPTILER_API_KEY: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
  },
});
