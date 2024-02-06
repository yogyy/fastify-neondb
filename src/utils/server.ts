import fastify from "fastify";
import { logger } from "./logger";
import { appplicatoinRoutes } from "@/modules/applications/apps.routes";
import { usersRoute } from "@/modules/users/users.routes";
import { roleRoutes } from "@/modules/roles/role.routes";
import guard from "fastify-guard";
import jwt from "jsonwebtoken";
import { env } from "@/config/env";

type User = {
  id: string;
  applicationId: string;
  scopes: Array<string>;
};

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

export async function buildServer() {
  const app = fastify({
    logger,
  });

  app.decorateRequest("user", null);

  app.addHook("onRequest", async function (req, reply) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return;
    }

    try {
      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, env.JWT_SECRET) as User;
      console.log(env.JWT_SECRET);
      console.log("user", decoded);

      req.user = decoded;
    } catch (error) {}
  });
  app.register(guard, {
    requestProperty: "user",
    scopeProperty: "scopes",
    errorHandler: (res, req, reply) => {
      return reply.code(400).send("you can not do that");
    },
  });

  app.register(appplicatoinRoutes, { prefix: "/api/applications" });
  app.register(usersRoute, { prefix: "/api/users" });
  app.register(roleRoutes, { prefix: "/api/roles" });

  return app;
}
