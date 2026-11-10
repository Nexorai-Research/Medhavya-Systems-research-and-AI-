import "server-only";
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

export function leadNotifier(): LeadNotifier {
  return env().LEAD_NOTIFIER === "console" ? consoleNotifier : noopNotifier;
}
