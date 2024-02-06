import { FastifyInstance } from "fastify";
import {
  AssignRoleToUserBody,
  LoginJsonSchema,
  assignRoleTouserJsonSchema,
  createUserJsonSchema,
} from "./users.schemas";
import {
  assignRoleToUserHandler,
  createUserHandler,
  loginHandler,
} from "./users.controllers";
import { PERMISSIONS } from "@/config/permission";

export async function usersRoute(app: FastifyInstance) {
  app.post("/", { schema: createUserJsonSchema }, createUserHandler);
  app.post("/login", { schema: LoginJsonSchema }, loginHandler);
  app.post<{ Body: AssignRoleToUserBody }>(
    "/roles",
    {
      schema: assignRoleTouserJsonSchema,
      preHandler: [app.guard.scope(PERMISSIONS["users:roles:write"])],
    },
    assignRoleToUserHandler,
  );
}
