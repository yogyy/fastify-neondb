import { env } from "./config/env";
import { buildServer } from "./utils/server";

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await buildServer();
  await app.listen({ port: env.PORT, host: env.HOST });

  const signals = ["SIGINT", "SIGTERM"];

  // logger.debug(env, "using env");
  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({ app });
    });
  }
}

main();
