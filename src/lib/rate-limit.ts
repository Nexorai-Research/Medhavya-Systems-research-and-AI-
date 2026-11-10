/**
 * In-memory sliding-window rate limiter. Suitable for a single instance and local development;
 * use a shared store (e.g. Redis or the database) when running multiple instances.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function check(key: string, now = Date.now()) {
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      const retryAfterMs = windowMs - (now - recent[0]);
      return { allowed: false as const, retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    return { allowed: true as const, remaining: limit - recent.length };
  };
}
