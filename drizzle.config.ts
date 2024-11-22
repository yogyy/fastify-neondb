import { env } from "@/config/env";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema.ts",
  out: "migration",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_CONNECTION,
  },
} satisfies Config;
