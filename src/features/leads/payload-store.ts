import "server-only";
import type { LeadRecord, LeadRepository, LeadStatus } from "./store";

/**
 * PostgreSQL adapter (through the CMS local API). Public submissions never touch the REST API:
 * the `leads` collection denies `create` to every request, and this adapter writes with
 * `overrideAccess` after the lead service has validated, de-duplicated and rate limited the input.
 */
type LeadDoc = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const orUndefined = <T>(value: T | null | undefined) => (value === null || value === undefined || value === "" ? undefined : value);

function toRecord(doc: LeadDoc): LeadRecord {
  const assigned = doc.assignedTo;
  return {
    name: doc.name,
    email: doc.email,
    enquiryType: doc.enquiryType,
    message: doc.message,
    phone: orUndefined(doc.phone),
    countryCode: orUndefined(doc.countryCode),
    organization: orUndefined(doc.organization),
    productSlug: orUndefined(doc.productSlug),
    categorySlug: orUndefined(doc.categorySlug),
    preferredContactTime: orUndefined(doc.preferredContactTime),
    source: orUndefined(doc.source),
    campaign: orUndefined(doc.campaign),
    marketingOptIn: Boolean(doc.consent?.marketingOptIn),
    reference: doc.reference,
    status: doc.status as LeadStatus,
    assignedTo: assigned ? String(typeof assigned === "object" ? assigned.id : assigned) : null,
    consent: { privacyAcknowledgedAt: new Date(doc.consent?.privacyAcknowledgedAt).toISOString(), marketingOptIn: Boolean(doc.consent?.marketingOptIn) },
    fingerprint: doc.fingerprint,
    createdAt: new Date(doc.createdAt).toISOString(),
    updatedAt: new Date(doc.updatedAt).toISOString(),
  };
}

export class PayloadLeadRepository implements LeadRepository {
  /** Payload is loaded lazily so the file-based store and unit tests never import the CMS. */
  private async cms() {
    const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
    return getPayload({ config });
  }

  async findRecentByFingerprint(fingerprint: string, sinceMs: number) {
    const payload = await this.cms();
    const since = new Date(Date.now() - sinceMs).toISOString();
    const result = await payload.find({
      collection: "leads" as never,
      where: { and: [{ fingerprint: { equals: fingerprint } }, { createdAt: { greater_than_equal: since } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    return result.docs[0] ? toRecord(result.docs[0] as LeadDoc) : undefined;
  }

  async create(record: LeadRecord) {
    const payload = await this.cms();
    await payload.create({
      collection: "leads" as never,
      overrideAccess: true,
      data: {
        reference: record.reference,
        status: record.status,
        enquiryType: record.enquiryType,
        name: record.name,
        email: record.email,
        phone: record.phone,
        countryCode: record.countryCode,
        organization: record.organization,
        message: record.message,
        productSlug: record.productSlug,
        categorySlug: record.categorySlug,
        preferredContactTime: record.preferredContactTime,
        source: record.source,
        campaign: record.campaign,
        consent: record.consent,
        fingerprint: record.fingerprint,
        createdAt: record.createdAt,
      } as never,
    });
  }
}
