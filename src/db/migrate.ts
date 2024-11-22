import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from ".";

async function main() {
  await migrate(db, {
    migrationsFolder: "./migration",
  });
}

main();
