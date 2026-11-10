import { describe, expect, it } from "vitest";
import { leadInputSchema, toFieldErrors } from "@/features/leads/schema";

const valid = {
  name: "  Asha Rao ",
  email: " Asha@Example.COM ",
  enquiryType: "ProductDemo",
  message: "We would like to see the attendance workflow.",
  privacyAcknowledged: true,
};

describe("leadInputSchema", () => {
  it("accepts a minimal valid submission and normalises input", () => {
    const r = leadInputSchema.parse(valid);
    expect(r.name).toBe("Asha Rao");
    expect(r.email).toBe("asha@example.com");
    expect(r.marketingOptIn).toBe(false);
  });

  it("requires privacy acknowledgement", () => {
    const r = leadInputSchema.safeParse({ ...valid, privacyAcknowledged: false });
    expect(r.success).toBe(false);
    expect(toFieldErrors(r.error!).privacyAcknowledged).toBeTruthy();
  });

  it("rejects privileged fields from the browser", () => {
    for (const extra of [{ status: "Qualified" }, { assignedTo: "admin" }, { score: 99 }, { owner: "x" }]) {
      const r = leadInputSchema.safeParse({ ...valid, ...extra });
      expect(r.success, JSON.stringify(extra)).toBe(false);
    }
  });

  it("rejects unknown enquiry types and invalid emails", () => {
    expect(leadInputSchema.safeParse({ ...valid, enquiryType: "Hack" }).success).toBe(false);
    expect(leadInputSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("enforces length limits", () => {
    expect(leadInputSchema.safeParse({ ...valid, message: "x".repeat(4001) }).success).toBe(false);
    expect(leadInputSchema.safeParse({ ...valid, message: "short" }).success).toBe(false);
    expect(leadInputSchema.safeParse({ ...valid, name: "a".repeat(121) }).success).toBe(false);
  });

  it("validates optional phone and slug formats", () => {
    expect(leadInputSchema.safeParse({ ...valid, phone: "+91 98765 43210" }).success).toBe(true);
    expect(leadInputSchema.safeParse({ ...valid, phone: "<script>" }).success).toBe(false);
    expect(leadInputSchema.safeParse({ ...valid, productSlug: "../etc/passwd" }).success).toBe(false);
  });

  it("accepts the honeypot field so the service can discard bots without revealing it", () => {
    expect(leadInputSchema.safeParse({ ...valid, website: "http://spam" }).success).toBe(true);
    expect(leadInputSchema.safeParse({ ...valid, website: "x".repeat(501) }).success).toBe(false);
  });
});
