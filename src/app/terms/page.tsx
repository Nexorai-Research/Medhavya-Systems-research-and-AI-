import { LegalDraft } from "@/components/LegalDraft";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Terms of Use", description: "Terms governing use of the Medhavya Systems website.", path: "/terms" });

export default function TermsPage() {
  return (
    <LegalDraft
      title="Terms of Use"
      summary="The terms that will govern use of this website."
      sections={[
        { heading: "Website content", body: "Product descriptions, lifecycle statuses and illustrative interfaces describe products as they stand and may change. Content marked as a demo listing is illustrative." },
        { heading: "No professional advice", body: "Content about financial, healthcare or other regulated domains is general information and not professional advice." },
        { heading: "Intellectual property, liability and governing law", body: "To be completed after legal review." },
      ]}
    />
  );
}
