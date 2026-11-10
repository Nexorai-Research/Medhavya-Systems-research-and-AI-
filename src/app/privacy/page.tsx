import { LegalDraft } from "@/components/LegalDraft";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacy Notice", description: "How Medhavya Systems handles personal data submitted through this website.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <LegalDraft
      title="Privacy Notice"
      summary="How this website collects and uses personal data."
      sections={[
        { heading: "What we collect through enquiry forms", body: "Your name, email address and message, plus optional details you choose to provide: organisation, phone number, product of interest and preferred contact time. We also record whether you acknowledged this notice and, separately, whether you opted in to product updates." },
        { heading: "Why we collect it", body: "To respond to your enquiry, arrange demonstrations or consultations, and follow up on the request you made. Marketing updates are sent only if you opt in." },
        { heading: "What we do not collect", body: "Please do not submit patient records, health information, student records, information about minors, passwords, brokerage credentials or trading API keys through this website." },
        { heading: "Analytics", body: "Website analytics, when enabled, record page and interaction events only. Form contents such as names, emails, phone numbers and messages are never sent to analytics providers." },
        { heading: "Retention, rights and contact", body: "To be completed after legal review, including applicable requirements under India’s Digital Personal Data Protection Act and the laws of other markets we serve." },
      ]}
    />
  );
}
