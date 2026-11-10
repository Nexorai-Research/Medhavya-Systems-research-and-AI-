# 08 — Forms and Validation

## Forms

| Form | Where | Enquiry type |
| --- | --- | --- |
| Contact | `/contact` | Chosen by the visitor (8 types) |
| Request demo | `/request-demo` (supports `?product=slug`) | ProductDemo |
| Enterprise consultation | `/enterprise-solutions#consult` and service pages | EnterpriseConsultation |
| Careers introduction | `/careers` | Career |
| Partnership enquiry | `/partners` | Partnership |

All use `features/leads/LeadForm.tsx`, which posts JSON to `POST /api/leads`.

## Enquiry types

ProductDemo · EnterpriseConsultation · General · Sales · Service · Partnership · Support · Career.

## Field rules (`features/leads/schema.ts`, Zod 4, shared by browser and server)

| Field | Rule |
| --- | --- |
| name | required, 2–120 characters |
| email | required, valid, lower-cased, up to 254 characters |
| message | required, 10–4000 characters |
| enquiryType | one of the 8 values |
| privacyAcknowledged | must be `true` |
| phone | optional; digits, spaces, dashes, brackets, optional leading `+`. With `+`: 8–15 digits. Without: 6–15 |
| organization, preferredContactTime, source, campaign, countryCode | optional, length-limited |
| productSlug, categorySlug | optional, lower-case slug pattern |
| marketingOptIn | optional, separate from the privacy acknowledgement |
| website | honeypot, hidden from people |

The schema is `.strict()`: unknown or privileged keys (status, assignedTo, score) are rejected.

## Server pipeline (`app/api/leads/route.ts`, `features/leads/service.ts`)

1. Same-origin check (403).
2. Content-type must be JSON (415).
3. Per-IP rate limit, default 5 per 10 minutes (429 with `Retry-After`).
4. Body limit 16 KB (413).
5. JSON parse (400), schema validation with field-level errors (400).
6. Honeypot filled: fake success, nothing stored.
7. De-duplication within 10 minutes by fingerprint: returns the existing reference.
8. Persist, then notify. A notification failure is logged and does not fail the visitor.
9. Response: an opaque reference such as `MS-XXXXXXXXXX` and a request id. No personal data in logs.

## Known limits

- Local file store and in-memory rate limiter are not production-safe (see audit).
- No file upload: deliberately omitted.
- No email or CRM delivery: `LEAD_NOTIFIER` is `console` or `none`.
- Validation messages are English only.
