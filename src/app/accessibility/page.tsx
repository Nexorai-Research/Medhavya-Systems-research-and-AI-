import { LegalDraft } from "@/components/LegalDraft";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Accessibility", description: "Accessibility commitment for the Medhavya Systems website.", path: "/accessibility" });

export default function AccessibilityPage() {
  return (
    <LegalDraft
      title="Accessibility Statement"
      summary="Our commitment to making this website usable by everyone."
      sections={[
        { heading: "Our target", body: "We design this website to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA: semantic structure, keyboard navigation, visible focus, sufficient contrast, labelled forms and reduced-motion support." },
        { heading: "Known limitations", body: "A formal accessibility audit has not yet been completed. Results and any known issues will be published here." },
        { heading: "Feedback", body: "If you encounter a barrier on this site, please tell us through the contact form so we can fix it." },
      ]}
    />
  );
}
