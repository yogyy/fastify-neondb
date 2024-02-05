import { InferInsertModel, eq } from "drizzle-orm";
import { db } from "@/db";
import { applications } from "@/db/schema";

export async function createApps(data: InferInsertModel<typeof applications>) {
  const res = await db.insert(applications).values(data).returning();

  return res[0];
}

export async function getApps() {
  // SELECT * FROM applications
  const res = await db
    .select({
      id: applications.id,
      name: applications.name,
      createdAt: applications.createdAt,
    })
    .from(applications);

  return res;
}
