import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { LeadForm } from "@/features/leads/LeadForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Work with Medhavya Systems. Tell us about your skills and the kind of work you want to do.",
  path: "/careers",
});

// TODO(founder): replace with real open roles, hiring process and benefits once confirmed.
const ways = [
  { title: "Engineering", text: "Web, mobile, data and applied AI engineering across our products and client projects." },
  { title: "Design", text: "Product, interaction and accessibility design for complex business software." },
  { title: "Delivery and consulting", text: "Analysis, project delivery and customer success for enterprise engagements." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build practical technology with us."
        intro="We have no roles published on this site yet. If your skills fit the areas below, introduce yourself and we will get back to you when a suitable role opens."
        crumbs={[{ label: "Company", href: "/about" }, { label: "Careers" }]}
        visual={<ConversationVisual />}
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-xl font-semibold text-midnight">Areas we hire in</h2>
            <ul className="mt-5 space-y-4">
              {ways.map((w) => (
                <li key={w.title} className="rounded-[var(--radius-md)] border border-line bg-white p-4">
                  <p className="font-semibold text-midnight">{w.title}</p>
                  <p className="mt-1 text-sm text-muted">{w.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div id="contact-form" className="rounded-[var(--radius-lg)] border border-line bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-midnight">Introduce yourself</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Share your background and the work you are looking for. Please do not include sensitive personal information.</p>
            <LeadForm enquiryType="Career" submitLabel="Send introduction" />
          </div>
        </Container>
      </section>
    </>
  );
}
