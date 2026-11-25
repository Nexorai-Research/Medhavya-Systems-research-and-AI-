import { Code2, Compass, PenTool } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { AccentBar, Container, SectionHeading } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { HeroPhotoBackground } from "@/components/visuals/HeroPhotoBackground";
import { LeadForm } from "@/features/leads/LeadForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers",
  description: "Work with Medhavya Systems. Tell us about your skills and the kind of work you want to do.",
  path: "/careers",
});

// TODO(founder): replace with real open roles, hiring process and benefits once confirmed.
// Tints are full class names so Tailwind keeps them.
const ways = [
  { Icon: Code2, title: "Engineering", text: "Web, mobile, data and applied AI engineering across our products and client projects.", tint: "bg-blue-100 text-primary", bar: "from-primary to-electric" },
  { Icon: PenTool, title: "Design", text: "Product, interaction and accessibility design for complex business software.", tint: "bg-violet-100 text-violet-700", bar: "from-violet-500 to-fuchsia-400" },
  { Icon: Compass, title: "Delivery and consulting", text: "Analysis, project delivery and customer success for enterprise engagements.", tint: "bg-emerald-100 text-emerald-700", bar: "from-emerald-500 to-teal-400" },
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
        background={<HeroPhotoBackground src="/images/company/careers.jpg" position="70% 40%" />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Open to" title="Areas we hire in" />
            <ul data-reveal-group="80" className="mt-8 space-y-4">
              {ways.map(({ Icon, title, text, tint, bar }) => (
                <li key={title} className="group relative flex gap-4 overflow-hidden rounded-[var(--radius-md)] border border-line bg-white p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                  <AccentBar className={bar} />
                  <span aria-hidden className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tint}`}>
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="font-semibold text-midnight">{title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div id="contact-form" className="relative scroll-mt-24 overflow-hidden rounded-[var(--radius-xl)] border border-white/80 bg-white/90 p-6 shadow-[var(--shadow-lift)] backdrop-blur-md sm:p-8">
            <AccentBar className="from-primary via-electric to-cyan" />
            <h2 className="text-xl font-semibold text-midnight">Introduce yourself</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Share your background and the work you are looking for. Please do not include sensitive personal information.</p>
            <LeadForm enquiryType="Career" submitLabel="Send introduction" />
          </div>
        </Container>
      </section>
    </>
  );
}
