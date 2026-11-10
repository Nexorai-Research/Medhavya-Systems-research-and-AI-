import "server-only";
import { createHash } from "node:crypto";
import { createRateLimiter } from "./rate-limit";
import { log } from "./log";

type Result = { allowed: true; remaining: number } | { allowed: false; retryAfterSeconds: number };

/**
 * Rate limiter shared by all instances through PostgreSQL (table `rate_limit_hits`).
 * Without DATABASE_URL, or if the database is unreachable, it falls back to the in-memory limiter
 * so a database outage never blocks genuine enquiries.
 */
export function createSharedRateLimiter({ limit, windowMs, useDatabase }: { limit: number; windowMs: number; useDatabase: boolean }) {
  const local = createRateLimiter({ limit, windowMs });
  let lastCleanup = 0;

  return async function check(rawKey: string): Promise<Result> {
    if (!useDatabase) return local(rawKey);
    try {
      const [{ getPayload }, { default: config }, { sql }] = await Promise.all([import("payload"), import("@payload-config"), import("@payloadcms/db-postgres")]);
      const payload = await getPayload({ config });
      const db = (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<{ rows: Record<string, unknown>[] }> } }).drizzle;
      const key = createHash("sha256").update(rawKey).digest("hex").slice(0, 32); // no raw IPs at rest
      const windowSeconds = windowMs / 1000;

      const res = await db.execute(sql`SELECT count(*)::int AS n, EXTRACT(EPOCH FROM (min(hit_at) + make_interval(secs => ${windowSeconds}) - now()))::int AS wait
        FROM rate_limit_hits WHERE key = ${key} AND hit_at > now() - make_interval(secs => ${windowSeconds})`);
      const n = Number(res.rows[0]?.n ?? 0);
      if (n >= limit) return { allowed: false, retryAfterSeconds: Math.max(1, Number(res.rows[0]?.wait ?? 1)) };

      await db.execute(sql`INSERT INTO rate_limit_hits (key) VALUES (${key})`);
      if (Date.now() - lastCleanup > 10 * 60 * 1000) {
        lastCleanup = Date.now();
        await db.execute(sql`DELETE FROM rate_limit_hits WHERE hit_at < now() - interval '1 day'`);
      }
      return { allowed: true, remaining: limit - n - 1 };
    } catch (error) {
      log.error("rate_limit.store_failed", { error: String(error) });
      return local(rawKey);
    }
  };
}
