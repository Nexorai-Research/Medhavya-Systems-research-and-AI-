import { z } from "zod";

/**
 * Server environment, validated on first use (Module 03 §6).
 * Every value has a safe local-development default; production must set them explicitly.
 */
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  /** Allow search engines to index this deployment. Keep false on staging. */
  SITE_INDEXABLE: z.enum(["true", "false"]).default("false"),
  /** PostgreSQL connection string. When set, leads are stored in PostgreSQL through the CMS; otherwise the local file store is used. */
  DATABASE_URL: z.preprocess((v) => (v === "" ? undefined : v), z.string().min(1).optional()),
  /** Directory for the local file-based lead store (development only). */
  LEAD_STORE_DIR: z.string().min(1).default(".data"),
  /** Notification adapter for new leads: "console" logs an opaque reference only. */
  LEAD_NOTIFIER: z.enum(["console", "none", "webhook"]).default("console"),
  /** Webhook destination (required when LEAD_NOTIFIER=webhook): https, or http only for localhost/127.0.0.1. */
  LEAD_WEBHOOK_URL: z.string().trim().optional(),
  /** Optional HMAC-SHA256 signing secret for webhook bodies. */
  LEAD_WEBHOOK_SECRET: z.string().min(1).optional(),
  LEAD_RATE_LIMIT_PER_10_MIN: z.coerce.number().int().positive().default(5),
}).superRefine((value, ctx) => {
  if (value.LEAD_NOTIFIER !== "webhook") return;
  const fail = (message: string) => ctx.addIssue({ code: "custom", path: ["LEAD_WEBHOOK_URL"], message });
  if (!value.LEAD_WEBHOOK_URL) return fail("LEAD_WEBHOOK_URL is required when LEAD_NOTIFIER=webhook");
  let url: URL;
  try {
    url = new URL(value.LEAD_WEBHOOK_URL);
  } catch {
    return fail("LEAD_WEBHOOK_URL must be a valid URL");
  }
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local)) {
    fail("LEAD_WEBHOOK_URL must use https (http is allowed only for localhost or 127.0.0.1)");
  }
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function env(): Env {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(`Invalid environment configuration: ${z.prettifyError(parsed.error)}`);
    }
    cached = parsed.data;
  }
  return cached;
}

export const siteUrl = () => env().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
