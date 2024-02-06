import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@/config/env";
import postgres from "postgres";

// const pool = new Pool({
// connectionString: env.DATABASE_CONNECTION,
// ssl: true,
// host: process.env.DB_host,
// database: process.env.DB_database,
// port: 5432,
// user: process.env.DB_user,
// password: process.env.DB_password,
// });

const connectionString = env.DATABASE_CONNECTION;
const client = postgres(connectionString);

export const db = drizzle(client);
