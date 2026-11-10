import { createHmac } from "node:crypto";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createWebhookNotifier } from "@/features/leads/notifier";
import type { LeadRecord } from "@/features/leads/store";
import { envSchema } from "@/lib/env";

const lead = {
  reference: "MS-ABC1234567",
  enquiryType: "General",
  name: "Asha Rao",
  email: "asha@example.com",
  phone: "+911234567890",
  organization: "Acme",
  message: "Hello there, a long enough message.",
  productSlug: "p",
  categorySlug: "c",
  source: "/contact",
  campaign: "x",
  marketingOptIn: false,
  status: "New",
  assignedTo: null,
  consent: { privacyAcknowledgedAt: "2026-01-01T00:00:00.000Z", marketingOptIn: true },
  fingerprint: "secret-fingerprint",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
} as unknown as LeadRecord;

describe("webhook notifier", () => {
  let server: http.Server;
  let url: string;
  let handler: http.RequestListener;
  const received: { body: string; headers: http.IncomingHttpHeaders }[] = [];

  beforeEach(async () => {
    received.length = 0;
    handler = (req, res) => {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        received.push({ body, headers: req.headers });
        res.statusCode = 200;
        res.end("ok");
      });
    };
    server = http.createServer((req, res) => handler(req, res));
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/hook`;
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    server.closeAllConnections();
    await new Promise((r) => server.close(r));
  });

  it("posts only the listed fields and signs the raw body", async () => {
    await createWebhookNotifier({ url, secret: "s3cret" }).notify(lead);
    expect(received).toHaveLength(1);
    const { body, headers } = received[0];
    const payload = JSON.parse(body);
    expect(Object.keys(payload).sort()).toEqual(
      ["reference", "enquiryType", "name", "email", "phone", "organization", "message", "productSlug", "categorySlug", "source", "campaign", "marketingOptIn", "createdAt"].sort(),
    );
    expect(payload.marketingOptIn).toBe(true);
    expect(body).not.toContain("secret-fingerprint");
    expect(headers["x-medhavya-signature"]).toBe(`sha256=${createHmac("sha256", "s3cret").update(body).digest("hex")}`);
  });

  it("omits the signature header without a secret", async () => {
    await createWebhookNotifier({ url }).notify(lead);
    expect(received[0].headers["x-medhavya-signature"]).toBeUndefined();
  });

  it("throws on non-2xx without leaking personal data", async () => {
    handler = (_req, res) => {
      res.statusCode = 500;
      res.end("no");
    };
    const error = await createWebhookNotifier({ url }).notify(lead).catch((e: Error) => e);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain("500");
    expect((error as Error).message).not.toContain("asha@example.com");
  });

  it("throws on timeout", async () => {
    handler = () => {};
    await expect(createWebhookNotifier({ url, timeoutMs: 100 }).notify(lead)).rejects.toThrow(/timed out/);
  });
});

describe("webhook env validation", () => {
  const parse = (extra: Record<string, string>) => envSchema.safeParse({ LEAD_NOTIFIER: "webhook", ...extra });

  it("rejects a missing URL", () => {
    expect(parse({}).success).toBe(false);
  });
  it("rejects non-https remote URLs and garbage", () => {
    expect(parse({ LEAD_WEBHOOK_URL: "http://example.com/h" }).success).toBe(false);
    expect(parse({ LEAD_WEBHOOK_URL: "not a url" }).success).toBe(false);
  });
  it("accepts https and local http", () => {
    expect(parse({ LEAD_WEBHOOK_URL: "https://example.com/h" }).success).toBe(true);
    expect(parse({ LEAD_WEBHOOK_URL: "http://localhost:4000/h" }).success).toBe(true);
    expect(parse({ LEAD_WEBHOOK_URL: "http://127.0.0.1:4000/h" }).success).toBe(true);
  });
  it("does not require a URL for other notifiers", () => {
    expect(envSchema.safeParse({ LEAD_NOTIFIER: "none" }).success).toBe(true);
  });
});
