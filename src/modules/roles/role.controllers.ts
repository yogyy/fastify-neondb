import { FastifyReply, FastifyRequest } from "fastify";
import { CreateRoleBody } from "./role.schemas";
import { createRole } from "./roles.services";

export async function createRolehandler(
  req: FastifyRequest<{
    Body: CreateRoleBody;
  }>,
  reply: FastifyReply,
) {
  const user = req.user;
  const applicationId = user.applicationId;
  const { name, permissions } = req.body;
  const role = await createRole({
    name,
    permissions,
    applicationId,
  });

  return role;
}
