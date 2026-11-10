import { describe, expect, it } from "vitest";
import { createSharedRateLimiter } from "@/lib/shared-rate-limit";

describe("shared rate limiter", () => {
  it("falls back to the in-memory limiter when no database is configured", async () => {
    const check = createSharedRateLimiter({ limit: 2, windowMs: 60_000, useDatabase: false });
    expect((await check("ip")).allowed).toBe(true);
    expect((await check("ip")).allowed).toBe(true);
    expect((await check("ip")).allowed).toBe(false);
    expect((await check("other")).allowed).toBe(true);
  });
});
