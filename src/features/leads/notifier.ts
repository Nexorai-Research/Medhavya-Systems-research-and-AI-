import "server-only";
import { createHmac } from "node:crypto";
import { env } from "@/lib/env";
import { log } from "@/lib/log";
import type { LeadRecord } from "./store";

/** Notification port (Module 03 §10). Email/CRM adapters plug in here with server-side credentials. */
export interface LeadNotifier {
  notify(lead: LeadRecord): Promise<void>;
}

/** Development adapter: logs only the opaque reference and enquiry type — never personal data. */
const consoleNotifier: LeadNotifier = {
  async notify(lead) {
    log.info("lead.notification.queued", { reference: lead.reference, enquiryType: lead.enquiryType });
  },
};

const noopNotifier: LeadNotifier = { async notify() {} };

const WEBHOOK_TIMEOUT_MS = 5000;

/** Exactly the fields sent to the owner-configured destination. Nothing else (no fingerprint, consent internals) is allowed. */
export function webhookPayload(lead: LeadRecord) {
  return {
    reference: lead.reference,
    enquiryType: lead.enquiryType,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    organization: lead.organization,
    message: lead.message,
    productSlug: lead.productSlug,
    categorySlug: lead.categorySlug,
    source: lead.source,
    campaign: lead.campaign,
    marketingOptIn: lead.consent.marketingOptIn,
    createdAt: lead.createdAt,
  };
}

/**
 * Generic webhook adapter. Personal data deliberately leaves the site to the destination the owner configured.
 * Logs and errors carry only the opaque reference and HTTP status. Single attempt, no retries in the request path.
 */
export function createWebhookNotifier(options: { url: string; secret?: string; timeoutMs?: number }): LeadNotifier {
  return {
    async notify(lead) {
      const body = JSON.stringify(webhookPayload(lead));
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (options.secret) {
        headers["X-Medhavya-Signature"] = `sha256=${createHmac("sha256", options.secret).update(body).digest("hex")}`;
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? WEBHOOK_TIMEOUT_MS);
      let response: Response;
      try {
        response = await fetch(options.url, { method: "POST", headers, body, signal: controller.signal, redirect: "error" });
      } catch {
        throw new Error(controller.signal.aborted ? "Lead webhook timed out" : "Lead webhook request failed");
      } finally {
        clearTimeout(timer);
      }
      if (!response.ok) throw new Error(`Lead webhook responded with HTTP ${response.status}`);
      log.info("lead.webhook.delivered", { reference: lead.reference, status: response.status });
    },
  };
}

let webhook: LeadNotifier | undefined;

export function leadNotifier(): LeadNotifier {
  const config = env();
  if (config.LEAD_NOTIFIER === "webhook") {
    // env() has already validated that LEAD_WEBHOOK_URL is present and safe.
    webhook ??= createWebhookNotifier({ url: config.LEAD_WEBHOOK_URL!, secret: config.LEAD_WEBHOOK_SECRET });
    return webhook;
  }
  return config.LEAD_NOTIFIER === "console" ? consoleNotifier : noopNotifier;
}
