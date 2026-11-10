import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { LeadForm } from "@/features/leads/LeadForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Partners",
  description: "Partner with Medhavya Systems on technology integration, implementation and industry solutions.",
  path: "/partners",
});

// TODO(founder): confirm partnership models before launch. No existing partners are claimed.
const models = [
  { title: "Technology partners", text: "Integrate your platform or service with Medhavya products." },
  { title: "Implementation partners", text: "Deliver and support Medhavya solutions for clients in your region or sector." },
  { title: "Industry and research partners", text: "Collaborate on applied research and sector-specific solutions." },
];

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Partner with Medhavya Systems."
        intro="We are open to partnerships where both sides gain. We do not list partners on this site until agreements are confirmed."
        crumbs={[{ label: "Company", href: "/about" }, { label: "Partners" }]}
        visual={<ConversationVisual />}
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-xl font-semibold text-midnight">Ways to work together</h2>
            <ul className="mt-5 space-y-4">
              {models.map((m) => (
                <li key={m.title} className="rounded-[var(--radius-md)] border border-line bg-white p-4">
                  <p className="font-semibold text-midnight">{m.title}</p>
                  <p className="mt-1 text-sm text-muted">{m.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div id="contact-form" className="rounded-[var(--radius-lg)] border border-line bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-midnight">Start a conversation</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Tell us about your organisation and what you have in mind.</p>
            <LeadForm enquiryType="Partnership" submitLabel="Send partnership enquiry" />
          </div>
        </Container>
      </section>
    </>
  );
}
