import { FastifyInstance } from "fastify";
import { CreateRoleBody, createRoleJsonSchema } from "./role.schemas";
import { createRolehandler } from "./role.controllers";
import { PERMISSIONS } from "@/config/permission";

export async function roleRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateRoleBody }>(
    "/",
    {
      schema: createRoleJsonSchema,
      preHandler: [app.guard.scope([PERMISSIONS["roles:write"]])],
    },
    createRolehandler,
  );
}
