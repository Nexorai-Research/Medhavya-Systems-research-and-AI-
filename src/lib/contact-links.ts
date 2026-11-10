/** Normalise a phone-like string to digits only; returns null unless it is a plausible international number (E.164: 8-15 digits). */
export function normalizeInternationalNumber(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!/^[+\d][\d\s().-]*$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0") || digits.length < 8 || digits.length > 15) return null;
  return digits;
}

/** `tel:` link for a plausible international number, otherwise null (render nothing). */
export function telHref(value: string | null | undefined): string | null {
  const digits = normalizeInternationalNumber(value);
  return digits ? `tel:+${digits}` : null;
}

/** WhatsApp click-to-chat link, otherwise null (render nothing). */
export function whatsappHref(value: string | null | undefined): string | null {
  const digits = normalizeInternationalNumber(value);
  return digits ? `https://wa.me/${digits}` : null;
}
