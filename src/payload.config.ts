import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { EnterpriseServices, Industries, ProductCategories, Products, Resources } from "./cms/collections/content";
import { Leads } from "./cms/collections/Leads";
import { Users } from "./cms/collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));

function secret() {
  const value = process.env.PAYLOAD_SECRET;
  if (value) return value;
  // `next build` evaluates this module without serving requests; a real secret is required at runtime.
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("PAYLOAD_SECRET must be set in production");
  }
  return "development-only-secret-do-not-use-in-production";
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  secret: secret(),
  routes: { api: "/cms-api" }, // keeps /api/* free for the public site's own routes
  graphQL: { disable: true },
  admin: {
    user: Users.slug,
    avatar: "default", // no third-party (Gravatar) requests
    meta: { titleSuffix: " · Medhavya CMS" },
  },
  collections: [Users, ProductCategories, Products, Industries, EnterpriseServices, Resources, Leads],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    migrationDir: path.resolve(dirname, "../migrations"),
    push: false, // schema changes ship as reviewed migrations: `npm run cms:migrate`
  }),
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
