import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const createAppBodySchema = z.object({
  name: z.string({
    required_error: "Name is Required",
  }),
});

export type CreateAppBody = z.infer<typeof createAppBodySchema>;

export const createAppJsonSchema = {
  body: zodToJsonSchema(createAppBodySchema, "createAppBodySchema"),
};
