"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { ENQUIRY_TYPES, enquiryLabels, leadInputSchema, toFieldErrors, type EnquiryType, type FieldErrors } from "./schema";

interface Option {
  value: string;
  label: string;
}

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success"; reference: string } | { kind: "error"; message: string; requestId?: string };

export function LeadForm({
  enquiryType: fixedType,
  products = [],
  submitLabel = "Send enquiry",
  showTypeSelect = false,
}: {
  enquiryType?: EnquiryType;
  products?: Option[];
  submitLabel?: string;
  showTypeSelect?: boolean;
}) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [productSlug, setProductSlug] = useState("");

  // Pre-select a product from ?product= and capture campaign attribution (no personal data).
  // Runs once after hydration; the product list is read through a ref so a new array
  // identity on re-render can never retrigger it.
  const productsRef = useRef(products);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("product");
    if (p && productsRef.current.some((o) => o.value === p)) setProductSlug(p);
  }, []);

  const onFocus = () => {
    if (!started.current) {
      started.current = true;
      track("form_start", { form: fixedType ?? "General" });
    }
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const str = (k: string) => {
      const v = fd.get(k);
      return typeof v === "string" && v.trim() !== "" ? v : undefined;
    };
    const payload = {
      name: str("name") ?? "",
      email: str("email") ?? "",
      enquiryType: (str("enquiryType") ?? fixedType ?? "General") as EnquiryType,
      message: str("message") ?? "",
      privacyAcknowledged: fd.get("privacyAcknowledged") === "on",
      phone: str("phone"),
      organization: str("organization"),
      productSlug: str("productSlug"),
      preferredContactTime: str("preferredContactTime"),
      marketingOptIn: fd.get("marketingOptIn") === "on",
      // Campaign attribution only (never personal data), read at submit time.
      source: new URLSearchParams(window.location.search).get("utm_source") ?? undefined,
      campaign: new URLSearchParams(window.location.search).get("utm_campaign") ?? undefined,
      website: str("website"),
    };

    const check = leadInputSchema.safeParse(payload);
    if (!check.success) {
      const fieldErrors = toFieldErrors(check.error);
      setErrors(fieldErrors);
      const first = Object.keys(fieldErrors)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus({ kind: "success", reference: data.reference });
        track("form_success", { form: payload.enquiryType });
        return;
      }
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: "idle" });
        return;
      }
      setStatus({ kind: "error", message: data.error ?? "Something went wrong. Please try again.", requestId: data.requestId });
    } catch {
      setStatus({ kind: "error", message: "We could not reach the server. Check your connection and try again." });
    }
  }

  if (status.kind === "success") {
    return (
      <div role="status" className="animate-rise rounded-[var(--radius-lg)] border border-green-200 bg-success-bg p-8">
        <span aria-hidden className="success-mark relative flex size-14 items-center justify-center">
          <span className="success-ring absolute inset-0 rounded-full border-2 border-success/40" />
          <span className="success-ring absolute inset-0 rounded-full border-2 border-success/30 [animation-delay:0.25s]" />
          <svg viewBox="0 0 52 52" className="size-14">
            <circle className="success-circle" cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="3" pathLength={1} />
            <path className="success-check" d="M15 27 L23 35 L38 18" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
          </svg>
        </span>
        <h2 className="mt-4 text-xl font-semibold text-midnight">Thank you — we have your enquiry.</h2>
        <p className="mt-2 leading-relaxed text-ink">
          Your reference is <strong className="font-mono">{status.reference}</strong>. A member of our team will reply by email. We aim to respond within two business days.
        </p>
      </div>
    );
  }

  const field = (name: keyof FieldErrors) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} onFocus={onFocus} noValidate className="grid gap-5">
      {status.kind === "error" && (
        <div role="alert" className="flex gap-3 rounded-[var(--radius-md)] border border-red-200 bg-danger-bg p-4 text-sm text-danger">
          <AlertCircle aria-hidden className="size-5 shrink-0" />
          <p>
            {status.message}
            {status.requestId && <span className="mt-1 block font-mono text-xs opacity-80">Reference for support: {status.requestId}</span>}
          </p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor={`${id}-name`} error={errors.name} errorId={`${id}-name-error`} required>
          <input {...field("name")} autoComplete="name" required className={inputClass(errors.name)} />
        </Field>
        <Field label="Work email" htmlFor={`${id}-email`} error={errors.email} errorId={`${id}-email-error`} required>
          <input {...field("email")} type="email" autoComplete="email" required className={inputClass(errors.email)} />
        </Field>
        <Field label="Organization" htmlFor={`${id}-organization`} error={errors.organization} errorId={`${id}-organization-error`}>
          <input {...field("organization")} autoComplete="organization" className={inputClass(errors.organization)} />
        </Field>
        <Field label="Phone (with country code)" htmlFor={`${id}-phone`} error={errors.phone} errorId={`${id}-phone-error`}>
          <input {...field("phone")} type="tel" autoComplete="tel" placeholder="+91" className={inputClass(errors.phone)} />
        </Field>
      </div>

      {showTypeSelect && (
        <Field label="Enquiry type" htmlFor={`${id}-enquiryType`} error={errors.enquiryType} errorId={`${id}-enquiryType-error`} required>
          <select {...field("enquiryType")} defaultValue={fixedType ?? "General"} className={inputClass(errors.enquiryType)}>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {enquiryLabels[t]}
              </option>
            ))}
          </select>
        </Field>
      )}
      {!showTypeSelect && <input type="hidden" name="enquiryType" value={fixedType ?? "General"} />}

      {products.length > 0 && (
        <Field label="Product of interest" htmlFor={`${id}-productSlug`} error={errors.productSlug} errorId={`${id}-productSlug-error`}>
          <select {...field("productSlug")} value={productSlug} onChange={(e) => setProductSlug(e.target.value)} className={inputClass(errors.productSlug)}>
            <option value="">Not sure yet</option>
            {products.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field
        label="How can we help?"
        htmlFor={`${id}-message`}
        error={errors.message}
        errorId={`${id}-message-error`}
        required
        hint="Please do not include patient records, student data, passwords or financial account credentials."
      >
        <textarea {...field("message")} rows={5} required className={cn(inputClass(errors.message), "h-auto py-3")} />
      </Field>

      <Field label="Preferred contact time (optional)" htmlFor={`${id}-preferredContactTime`} error={errors.preferredContactTime} errorId={`${id}-preferredContactTime-error`}>
        <input {...field("preferredContactTime")} placeholder="e.g. Weekday mornings IST" className={inputClass(errors.preferredContactTime)} />
      </Field>

      {/* Honeypot — hidden from people and assistive technology */}
      <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-3 rounded-[var(--radius-md)] bg-canvas p-4">
        <label className="flex gap-3 text-sm text-ink">
          <input type="checkbox" {...field("privacyAcknowledged")} className="mt-0.5 size-4 shrink-0 accent-primary" />
          <span>
            I have read the{" "}
            <Link href="/privacy" className="font-medium text-primary underline underline-offset-2">
              privacy notice
            </Link>{" "}
            and agree that Medhavya Systems may use these details to respond to my enquiry. <span className="text-danger">*</span>
          </span>
        </label>
        {errors.privacyAcknowledged && (
          <p id={`${id}-privacyAcknowledged-error`} className="flex items-center gap-1.5 text-sm text-danger">
            <AlertCircle aria-hidden className="size-4" /> {errors.privacyAcknowledged}
          </p>
        )}
        <label className="flex gap-3 text-sm text-muted">
          <input type="checkbox" name="marketingOptIn" className="mt-0.5 size-4 shrink-0 accent-primary" />
          <span>Optional: send me occasional product updates. You can unsubscribe at any time.</span>
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          <span className="text-danger">*</span> Required fields
        </p>
        <Button type="submit" disabled={status.kind === "submitting"} className="sm:min-w-44">
          {status.kind === "submitting" ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

function inputClass(error?: string) {
  return cn(
    "h-11 w-full rounded-[var(--radius-md)] border bg-white px-3.5 text-sm text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 hover:border-primary/50 focus:border-primary focus:shadow-[0_0_0_4px_rgb(82_123_255/0.14)]",
    error ? "border-danger" : "border-line-strong",
  );
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  errorId: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-midnight">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-sm text-danger">
          <AlertCircle aria-hidden className="size-4 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}
