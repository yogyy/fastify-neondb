import { FastifyReply, FastifyRequest } from "fastify";
import { CreateAppBody } from "./apps.schemas";
import { createApps, getApps } from "./apps.services";
import { createRole } from "../roles/roles.services";
import {
  ALL_PERMISSIONS,
  SYSTEM_ROLES,
  USER_ROLE_PERMISSIONS,
} from "@/config/permission";

export async function createAppHandler(
  request: FastifyRequest<{
    Body: CreateAppBody;
  }>,
  reply: FastifyReply,
) {
  const { name } = request.body;
  const apps = await createApps({
    name,
  });

  const superAdminRolePromise = await createRole({
    applicationId: apps.id,
    name: SYSTEM_ROLES.SUPER_ADMIN,
    permissions: ALL_PERMISSIONS as unknown as Array<string>,
  });

  const appUserRolePromise = await createRole({
    applicationId: apps.id,
    name: SYSTEM_ROLES.APP_USER,
    permissions: USER_ROLE_PERMISSIONS,
  });

  const [superAdminRole, appUserRole] = await Promise.allSettled([
    superAdminRolePromise,
    appUserRolePromise,
  ]);

  if (superAdminRole.status === "rejected") {
    throw new Error("Error creating super admin role");
  }

  if (appUserRole.status === "rejected") {
    throw new Error("Error creating application user role");
  }

  return {
    apps,
    superAdminRole: superAdminRole.value,
    applicationUserRole: appUserRole.value,
  };
}

export async function getAppHandler() {
  return getApps();
}
