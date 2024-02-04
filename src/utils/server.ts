import fastify from "fastify";
import { logger } from "./logger";
import { appplicatoinRoutes } from "@/modules/applications/apps.routes";
import { usersRoute } from "@/modules/users/users.routes";

export async function buildServer() {
  const app = fastify({
    logger,
  });

  app.register(appplicatoinRoutes, { prefix: "/api/applications" });
  app.register(usersRoute, { prefix: "/api/users" });

  return app;
}
