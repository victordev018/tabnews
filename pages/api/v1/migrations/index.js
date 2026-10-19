import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();
router.get(getHanlder);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getMigrationsClientConfig() {
  let dbClient;
  dbClient = await database.getNewClient();

  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  return { dbClient, defaultMigrationOptions };
}

async function getHanlder(request, response) {
  const { dbClient, defaultMigrationOptions } =
    await getMigrationsClientConfig();

  try {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request, response) {
  const { dbClient, defaultMigrationOptions } =
    await getMigrationsClientConfig();
  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
}
