import { CalendarCheck, MessageSquareText, MonitorPlay } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { AccentBar, Container, SectionHeading } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { HeroPhotoBackground } from "@/components/visuals/HeroPhotoBackground";
import { LeadForm } from "@/features/leads/LeadForm";
import { getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Demo",
  description: "Request a product demonstration from Medhavya Systems.",
  path: "/request-demo",
});

// Tints are full class names so Tailwind keeps them.
const steps = [
  { Icon: MessageSquareText, title: "Tell us your context", text: "Share the product and the workflow you care about.", tile: "from-primary to-electric" },
  { Icon: CalendarCheck, title: "We schedule a session", text: "We reply by email to agree a time that suits your time zone.", tile: "from-violet-500 to-fuchsia-400" },
  { Icon: MonitorPlay, title: "A focused walkthrough", text: "We show what exists today and are clear about what is still on the roadmap.", tile: "from-emerald-500 to-teal-400" },
];

export default function RequestDemoPage() {
  const products = getProducts().map((p) => ({ value: p.slug, label: `${p.name} (${p.lifecycle})` }));
  return (
    <>
      <PageHero
        eyebrow="Product demo"
        title="See a Medhavya product in action."
        intro="Demos are tailored to your workflow and honest about each product’s current lifecycle stage."
        crumbs={[{ label: "Request a demo" }]}
        visual={<ConversationVisual mode="demo" />}
        background={<HeroPhotoBackground src="/images/company/demo.jpg" position="50% 30%" />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="How it works" title="Three simple steps" />
            <ol data-reveal-group="90" className="mt-8 space-y-4">
              {steps.map(({ Icon, title, text, tile }, i) => (
                <li key={title} className="group relative flex gap-4 overflow-hidden rounded-[var(--radius-md)] border border-line bg-white p-5 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                  <AccentBar className={tile} />
                  <span aria-hidden className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tile}`}>
                    <Icon className="size-5" />
                  </span>
                  <span>
                    <span className="font-mono text-xs text-muted">Step {i + 1}</span>
                    <span className="mt-0.5 block font-semibold text-midnight">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/80 bg-white/90 p-6 shadow-[var(--shadow-lift)] backdrop-blur-md sm:p-10">
            <AccentBar className="from-primary via-electric to-cyan" />
            <h2 className="text-xl font-semibold text-midnight">Demo request</h2>
            <p className="mt-1 mb-8 text-sm text-muted">We aim to reply within two business days.</p>
            <LeadForm enquiryType="ProductDemo" products={products} submitLabel="Request demo" />
          </div>
        </Container>
      </section>
    </>
  );
}
