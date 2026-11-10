import { createRequire } from "node:module";
import path from "node:path";

// Loads .env / .env.local exactly as `next dev` does. Import this FIRST in every CMS script.
// Payload bundles its own @next/env and expects a default export that the CJS build lacks when it
// is loaded through tsx, so we add one to every copy before the Payload config is imported.
type NextEnv = { loadEnvConfig: (dir: string) => unknown; default?: unknown };
const require = createRequire(import.meta.url);
const root = process.cwd();
const copies = [path.join(root, "node_modules/@next/env"), path.join(root, "node_modules/payload/node_modules/@next/env")];
for (const file of copies) {
  let mod: NextEnv;
  try {
    mod = require(file) as NextEnv;
  } catch {
    continue; // copy not installed
  }
  mod.default ??= mod;
}
(require("@next/env") as NextEnv).loadEnvConfig(process.cwd());
