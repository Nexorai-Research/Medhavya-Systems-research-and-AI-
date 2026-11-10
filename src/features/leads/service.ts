import "server-only";
import { log } from "@/lib/log";
import { leadInputSchema, toFieldErrors, type FieldErrors } from "./schema";
import { leadFingerprint, newLeadReference, type LeadRecord, type LeadRepository } from "./store";
import type { LeadNotifier } from "./notifier";

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

export type SubmitResult = { ok: true; reference: string } | { ok: false; errors: FieldErrors };

/**
 * Lead workflow: validate → spam check → de-duplicate → persist → notify (Module 01 §11).
 * Dependencies are injected so the workflow can be tested without I/O.
 */
export async function submitLead(raw: unknown, deps: { repo: LeadRepository; notifier: LeadNotifier; requestId: string; now?: Date }): Promise<SubmitResult> {
  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, errors: toFieldErrors(parsed.error) };

  const { website, privacyAcknowledged, ...input } = parsed.data;
  void privacyAcknowledged;

  // Honeypot filled: pretend success so bots learn nothing, but store nothing.
  if (website) {
    log.warn("lead.spam.honeypot", { requestId: deps.requestId });
    return { ok: true, reference: newLeadReference() };
  }

  const fingerprint = leadFingerprint(input);
  const existing = await deps.repo.findRecentByFingerprint(fingerprint, DUPLICATE_WINDOW_MS);
  if (existing) {
    log.info("lead.duplicate", { requestId: deps.requestId, reference: existing.reference });
    return { ok: true, reference: existing.reference };
  }

  const now = (deps.now ?? new Date()).toISOString();
  const record: LeadRecord = {
    ...input,
    reference: newLeadReference(),
    status: "New",
    assignedTo: null,
    consent: { privacyAcknowledgedAt: now, marketingOptIn: input.marketingOptIn },
    fingerprint,
    createdAt: now,
    updatedAt: now,
  };

  await deps.repo.create(record);
  log.info("lead.created", { requestId: deps.requestId, reference: record.reference, enquiryType: record.enquiryType });

  try {
    await deps.notifier.notify(record);
  } catch (error) {
    // The lead is safely stored; surface the failure for follow-up rather than failing the visitor.
    log.error("lead.notification.failed", { requestId: deps.requestId, reference: record.reference, error: String(error) });
  }

  return { ok: true, reference: record.reference };
}
