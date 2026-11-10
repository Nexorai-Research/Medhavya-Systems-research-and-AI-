/**
 * Liveness/readiness probe for load balancers and uptime monitors.
 * Returns 200 when the app is up (and the database answers, if one is configured), 503 otherwise.
 * It reveals no versions, hostnames or error details.
 */
export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  if (!process.env.DATABASE_URL) return Response.json({ status: "ok", database: "not-configured" }, { headers });
  try {
    const [{ getPayload }, { default: config }, { sql }] = await Promise.all([import("payload"), import("@payload-config"), import("@payloadcms/db-postgres")]);
    const payload = await getPayload({ config });
    await (payload.db as unknown as { drizzle: { execute: (q: unknown) => Promise<unknown> } }).drizzle.execute(sql`SELECT 1`);
    return Response.json({ status: "ok", database: "ok" }, { headers });
  } catch {
    return Response.json({ status: "degraded", database: "unreachable" }, { status: 503, headers });
  }
}
