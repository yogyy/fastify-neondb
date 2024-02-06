import { db } from "@/db";
import { roles } from "@/db/schema";
import { InferInsertModel, and, eq } from "drizzle-orm";

export async function createRole(data: InferInsertModel<typeof roles>) {
  const res = await db.insert(roles).values(data).returning();

  return res[0];
}

interface RoleProps {
  name: string;
  applicationId: string;
}
export async function getRoleByName({ name, applicationId }: RoleProps) {
  const res = await db
    .select()
    .from(roles)
    .where(and(eq(roles.name, name), eq(roles.applicationId, applicationId)))
    .limit(1);

  return res[0];
}
