import { db } from "@/db";
import { applications, roles, users, usersToRoles } from "@/db/schema";
import argon2d from "argon2";
import { InferInsertModel, and, eq } from "drizzle-orm";

export async function createUser(data: InferInsertModel<typeof users>) {
  const hashed = await argon2d.hash(data.password);
  const res = await db
    .insert(users)
    .values({
      ...data,
      password: hashed,
    })
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: applications.id,
    });

  return res[0];
}

export async function getUsersByApp(applicationId: string) {
  const res = await db
    .select()
    .from(users)
    .where(eq(users.applicationId, applicationId));

  return res;
}

export async function assignRoleToUser(
  data: InferInsertModel<typeof usersToRoles>,
) {
  const role = await db.insert(usersToRoles).values(data).returning();

  return role[0];
}

interface UserByEmail {
  email: string;
  applicationId: string;
}
export async function getUserByEmail({ email, applicationId }: UserByEmail) {
  const res = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      applicationId: users.applicationId,
      roleId: roles.id,
      password: users.password,
      permissions: roles.permissions,
    })
    .from(users)
    .where(and(eq(users.email, email), eq(users.applicationId, applicationId)))
    .leftJoin(
      usersToRoles,
      and(
        eq(usersToRoles.userId, users.id),
        eq(usersToRoles.applicationId, users.applicationId),
      ),
    )
    .leftJoin(roles, and(eq(roles.id, usersToRoles.roleId)));

  if (!res.length) {
    return null;
  }

  const user = res.reduce((acc, curr) => {
    if (!acc.id) {
      return {
        ...curr,
        permissions: new Set(curr.permissions),
      };
    }

    if (!curr.permissions) {
      return acc;
    }

    for (const permission of curr.permissions) {
      acc.permissions.add(permission);
    }

    return acc;
  }, {} as Omit<(typeof res)[number], "permissions"> & { permissions: Set<string> });

  return {
    ...user,
    permissions: Array.from(user.permissions),
  };
}
