import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";
import { leadNotifier } from "@/features/leads/notifier";
import { submitLead } from "@/features/leads/service";
import { leadRepository } from "@/features/leads/store";
import { env } from "@/lib/env";
import { log } from "@/lib/log";
import { createSharedRateLimiter } from "@/lib/shared-rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
const limiter = createSharedRateLimiter({ limit: env().LEAD_RATE_LIMIT_PER_10_MIN, windowMs: 10 * 60 * 1000, useDatabase: Boolean(env().DATABASE_URL) });

const json = (body: unknown, status: number, requestId: string, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId, ...headers } });

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

/** Rejects cross-site form posts: the Origin, when present, must match this host (CSRF defence). */
function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const requestId = randomUUID();

  if (!sameOrigin(request)) return json({ ok: false, error: "Forbidden", requestId }, 403, requestId);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Unsupported content type", requestId }, 415, requestId);
  }

  const rate = await limiter(clientKey(request));
  if (!rate.allowed) {
    log.warn("lead.rate_limited", { requestId });
    return json({ ok: false, error: "Too many submissions. Please try again later.", requestId }, 429, requestId, { "Retry-After": String(rate.retryAfterSeconds) });
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request too large", requestId }, 413, requestId);
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "Invalid JSON", requestId }, 400, requestId);
  }

  try {
    const result = await submitLead(body, { repo: leadRepository(), notifier: leadNotifier(), requestId });
    if (!result.ok) return json({ ok: false, errors: result.errors, requestId }, 400, requestId);
    return json({ ok: true, reference: result.reference }, 201, requestId);
  } catch (error) {
    log.error("lead.submit.failed", { requestId, error: String(error) });
    return json({ ok: false, error: "We could not save your enquiry. Please try again shortly.", requestId }, 500, requestId);
  }
}
