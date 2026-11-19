/**
 * Cloudflare Workers build wrapper.
 *
 * Cache Components hangs on Workers (its setTimeout() assumptions), so the Cloudflare build runs with
 * `cacheComponents` off (CF_BUILD=1, see next.config.ts). The `export const instant = false;` opt-outs in
 * dynamic pages are only valid with Cache Components on, so they are removed for the duration of the
 * build and restored afterwards (also on failure). The Docker build is unaffected.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const LINE = /^export const instant = false;[ \t]*(\r?)$/m;
const originals = new Map();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(tsx?|jsx?)$/.test(name)) {
      const text = readFileSync(full, "utf8");
      if (LINE.test(text)) {
        originals.set(full, text);
        writeFileSync(full, text.replace(LINE, "// (removed for the Cloudflare build: instant opt-out)$1"));
      }
    }
  }
}

function restore() {
  for (const [file, text] of originals) writeFileSync(file, text);
}

let status = 1;
try {
  walk(path.resolve("src/app"));
  console.log(`cf-build: temporarily patched ${originals.size} file(s)`);
  const args = process.argv.slice(2);
  const result = spawnSync("npx", ["opennextjs-cloudflare", "build", ...args], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, CF_BUILD: "1" },
  });
  status = result.status ?? 1;
} finally {
  restore();
  console.log("cf-build: restored source files");
}
process.exit(status);
