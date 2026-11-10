import { describe, expect, it } from "vitest";
import { normalizeInternationalNumber, telHref, whatsappHref } from "@/lib/contact-links";

describe("contact links", () => {
  it("normalises formatted international numbers", () => {
    expect(normalizeInternationalNumber("+1 (202) 555-0100")).toBe("12025550100");
    expect(normalizeInternationalNumber("0044 20 7946 0000")).toBe("442079460000");
  });
  it("builds tel and wa.me links", () => {
    expect(telHref("+1 202 555 0100")).toBe("tel:+12025550100");
    expect(whatsappHref("+1 202 555 0100")).toBe("https://wa.me/12025550100");
  });
  it("renders nothing for empty or implausible values", () => {
    for (const bad of [null, undefined, "", "   ", "12345", "0123456789", "call me", "+1 202 555 0100 ext 5", "1".repeat(16)]) {
      expect(telHref(bad)).toBeNull();
      expect(whatsappHref(bad)).toBeNull();
    }
  });
});
