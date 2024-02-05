import { FastifyInstance } from "fastify";
import { createAppJsonSchema } from "./apps.schemas";
import { createAppHandler, getAppHandler } from "./apps.controller";

export async function appplicatoinRoutes(app: FastifyInstance) {
  app.post("/", { schema: createAppJsonSchema }, createAppHandler);

  app.get("/", getAppHandler);
}
