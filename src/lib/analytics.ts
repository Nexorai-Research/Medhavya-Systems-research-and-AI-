/**
 * Consent-aware analytics facade (Module 04 §10). No provider is configured yet, so events
 * are dropped unless a provider is attached AND the visitor has consented. Personal fields
 * are stripped defensively before anything leaves the browser.
 */
type EventName = "cta_click" | "product_view" | "form_start" | "form_success" | "catalogue_filter";
type Props = Record<string, string | number | boolean | undefined>;

const BLOCKED_KEYS = /name|email|phone|message|organization|address/i;

export interface AnalyticsProvider {
  send(event: EventName, props: Props): void;
}

let provider: AnalyticsProvider | null = null;
let consented = false;

export function configureAnalytics(p: AnalyticsProvider | null, hasConsent: boolean) {
  provider = p;
  consented = hasConsent;
}

export function sanitize(props: Props): Props {
  return Object.fromEntries(Object.entries(props).filter(([k]) => !BLOCKED_KEYS.test(k)));
}

export function track(event: EventName, props: Props = {}) {
  if (!provider || !consented) return;
  provider.send(event, sanitize(props));
}
