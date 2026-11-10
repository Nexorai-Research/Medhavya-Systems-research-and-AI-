import { z } from "zod";

/**
 * Server environment, validated on first use (Module 03 §6).
 * Every value has a safe local-development default; production must set them explicitly.
 */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  /** Allow search engines to index this deployment. Keep false on staging. */
  SITE_INDEXABLE: z.enum(["true", "false"]).default("false"),
  /** Directory for the local file-based lead store (development only). */
  LEAD_STORE_DIR: z.string().min(1).default(".data"),
  /** Notification adapter for new leads: "console" logs an opaque reference only. */
  LEAD_NOTIFIER: z.enum(["console", "none"]).default("console"),
  LEAD_RATE_LIMIT_PER_10_MIN: z.coerce.number().int().positive().default(5),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function env(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(`Invalid environment configuration: ${z.prettifyError(parsed.error)}`);
    }
    cached = parsed.data;
  }
  return cached;
}

export const siteUrl = () => env().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
