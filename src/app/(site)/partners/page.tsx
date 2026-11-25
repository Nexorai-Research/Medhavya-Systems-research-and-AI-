import { FlaskConical, Handshake, Plug } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { AccentBar, Container, SectionHeading } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { HeroPhotoBackground } from "@/components/visuals/HeroPhotoBackground";
import { LeadForm } from "@/features/leads/LeadForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Partners",
  description: "Partner with Medhavya Systems on technology integration, implementation and industry solutions.",
  path: "/partners",
});

// TODO(founder): confirm partnership models before launch. No existing partners are claimed.
// Tints are full class names so Tailwind keeps them.
const models = [
  { Icon: Plug, title: "Technology partners", text: "Integrate your platform or service with Medhavya products.", tint: "bg-blue-100 text-primary", bar: "from-primary to-electric" },
  { Icon: Handshake, title: "Implementation partners", text: "Deliver and support Medhavya solutions for clients in your region or sector.", tint: "bg-emerald-100 text-emerald-700", bar: "from-emerald-500 to-teal-400" },
  { Icon: FlaskConical, title: "Industry and research partners", text: "Collaborate on applied research and sector-specific solutions.", tint: "bg-violet-100 text-violet-700", bar: "from-violet-500 to-fuchsia-400" },
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
        background={<HeroPhotoBackground src="/images/company/partners.jpg" position="50% 35%" />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Models" title="Ways to work together" />
            <ul data-reveal-group="80" className="mt-8 space-y-4">
              {models.map(({ Icon, title, text, tint, bar }) => (
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
            <h2 className="text-xl font-semibold text-midnight">Start a conversation</h2>
            <p className="mt-1 mb-6 text-sm text-muted">Tell us about your organisation and what you have in mind.</p>
            <LeadForm enquiryType="Partnership" submitLabel="Send partnership enquiry" />
          </div>
        </Container>
      </section>
    </>
  );
}
