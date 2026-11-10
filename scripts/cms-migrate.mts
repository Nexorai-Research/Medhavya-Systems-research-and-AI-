/**
 * Database migrations. Usage:
 *   npm run cms:migrate:create -- <name>   generate a migration from the collection config
 *   npm run cms:migrate                    apply pending migrations
 */
import { getCms } from "./_payload.mts";

const [command = "up", name = "update"] = process.argv.slice(2);
async function main() {
  const payload = await getCms();

  if (command === "create") {
    await payload.db.createMigration({ payload, migrationName: name });
    console.log("Migration created in ./migrations");
  } else if (command === "up") {
    await payload.db.migrate();
    console.log("Migrations applied");
  } else {
    console.error(`Unknown command "${command}". Use "create" or "up".`);
    process.exit(1);
  }


}

main().then(() => process.exit(0), (error) => {
  console.error(error);
  process.exit(1);
});
