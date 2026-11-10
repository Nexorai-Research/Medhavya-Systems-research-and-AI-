import { z } from "zod";

export const ENQUIRY_TYPES = ["ProductDemo", "EnterpriseConsultation", "General", "Partnership"] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export const enquiryLabels: Record<EnquiryType, string> = {
  ProductDemo: "Product demo",
  EnterpriseConsultation: "Enterprise consultation",
  General: "General enquiry",
  Partnership: "Partnership",
};

const slug = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9-]*$/, "Invalid reference");

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters`)
    .optional()
    .transform((v) => (v ? v : undefined));

/**
 * Public lead submission contract (Module 04 §4). `.strict()` rejects unknown keys, so
 * privileged fields such as status, assignedTo or score can never be set by a browser.
 */
export const leadInputSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(120, "Please keep your name under 120 characters"),
    email: z.string().trim().toLowerCase().max(254).pipe(z.email("Please enter a valid email address")),
    enquiryType: z.enum(ENQUIRY_TYPES, "Please choose an enquiry type"),
    message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)").max(4000, "Please keep your message under 4,000 characters"),
    privacyAcknowledged: z.literal(true, "Please confirm you have read the privacy notice"),
    phone: optionalText(32).refine((v) => !v || /^[+()\d\s-]{6,32}$/.test(v), "Please enter a valid phone number"),
    countryCode: optionalText(8),
    organization: optionalText(160),
    productSlug: slug.optional(),
    categorySlug: slug.optional(),
    preferredContactTime: optionalText(80),
    source: optionalText(120),
    campaign: optionalText(120),
    marketingOptIn: z.boolean().optional().default(false),
    /** Honeypot: real users never see this field. Non-empty values are silently discarded by the service. */
    website: z.string().max(500).optional(),
  })
  .strict();

export type LeadInput = z.infer<typeof leadInputSchema>;

export type FieldErrors = Partial<Record<keyof LeadInput | "form", string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = (issue.path[0] as keyof LeadInput | undefined) ?? "form";
    if (!out[key]) out[key] = issue.code === "unrecognized_keys" ? "Unexpected fields were submitted" : issue.message;
  }
  return out;
}
