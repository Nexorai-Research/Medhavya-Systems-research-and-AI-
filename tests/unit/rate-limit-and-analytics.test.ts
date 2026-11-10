import { describe, expect, it, vi } from "vitest";
import { configureAnalytics, sanitize, track } from "@/lib/analytics";
import { createRateLimiter } from "@/lib/rate-limit";

describe("createRateLimiter", () => {
  it("allows up to the limit then blocks within the window", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("ip", 0).allowed).toBe(true);
    expect(check("ip", 10).allowed).toBe(true);
    const blocked = check("ip", 20);
    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) expect(blocked.retryAfterSeconds).toBe(1);
    expect(check("other-ip", 20).allowed).toBe(true);
  });

  it("allows again after the window passes", () => {
    const check = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(check("ip", 0).allowed).toBe(true);
    expect(check("ip", 500).allowed).toBe(false);
    expect(check("ip", 1001).allowed).toBe(true);
  });
});

describe("analytics privacy", () => {
  it("strips personal fields", () => {
    expect(sanitize({ form: "ProductDemo", email: "a@b.c", userName: "x", phone: "1", message: "m" })).toEqual({ form: "ProductDemo" });
  });

  it("sends nothing without consent", () => {
    const send = vi.fn();
    configureAnalytics({ send }, false);
    track("form_start", { form: "General" });
    expect(send).not.toHaveBeenCalled();
    configureAnalytics({ send }, true);
    track("form_start", { form: "General", email: "a@b.c" });
    expect(send).toHaveBeenCalledWith("form_start", { form: "General" });
    configureAnalytics(null, false);
  });
});
