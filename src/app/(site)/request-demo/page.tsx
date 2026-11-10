import { CalendarCheck, MessageSquareText, MonitorPlay } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { LeadForm } from "@/features/leads/LeadForm";
import { getProducts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Request a Demo",
  description: "Request a product demonstration from Medhavya Systems.",
  path: "/request-demo",
});

const steps = [
  { Icon: MessageSquareText, title: "Tell us your context", text: "Share the product and the workflow you care about." },
  { Icon: CalendarCheck, title: "We schedule a session", text: "We reply by email to agree a time that suits your time zone." },
  { Icon: MonitorPlay, title: "A focused walkthrough", text: "We show what exists today and are clear about what is still on the roadmap." },
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
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <ol className="space-y-8">
            {steps.map(({ Icon, title, text }, i) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-midnight text-cyan">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="font-mono text-xs text-muted">Step {i + 1}</span>
                  <span className="mt-0.5 block font-semibold text-midnight">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="rounded-[var(--radius-xl)] border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-10">
            <h2 className="text-xl font-semibold text-midnight">Demo request</h2>
            <p className="mt-1 mb-8 text-sm text-muted">We aim to reply within two business days.</p>
            <LeadForm enquiryType="ProductDemo" products={products} submitLabel="Request demo" />
          </div>
        </Container>
      </section>
    </>
  );
}
