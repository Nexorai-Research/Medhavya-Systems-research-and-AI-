import { LegalDraft } from "@/components/LegalDraft";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Cookie Notice", description: "How the Medhavya Systems website uses cookies and similar technologies.", path: "/cookies" });

export default function CookiesPage() {
  return (
    <LegalDraft
      title="Cookie Notice"
      summary="How this website uses cookies and similar technologies."
      sections={[
        { heading: "Current status", body: "This website does not currently set analytics or advertising cookies. Only technical storage strictly necessary for the site to function may be used." },
        { heading: "If analytics are enabled", body: "Before any non-essential analytics are enabled, a consent choice will be presented and this notice updated with the provider, purpose and retention period." },
      ]}
    />
  );
}
