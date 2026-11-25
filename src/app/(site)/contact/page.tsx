import Link from "next/link";
import { ArrowRight, Clock, Handshake, Mail, MessageCircle, MonitorPlay, Building2, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { AccentBar, CardLabel, Container } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { HeroPhotoBackground } from "@/components/visuals/HeroPhotoBackground";
import { site } from "@/content/site";
import { LeadForm } from "@/features/leads/LeadForm";
import { telHref, whatsappHref } from "@/lib/contact-links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Medhavya Systems about products, enterprise projects or partnerships.",
  path: "/contact",
});

// Tints are full class names so Tailwind keeps them.
const routes = [
  { Icon: MonitorPlay, title: "Product demo", text: "See a product with our team.", href: "/request-demo", tint: "bg-blue-100 text-primary" },
  { Icon: Building2, title: "Enterprise project", text: "Discuss custom software or AI work.", href: "/enterprise-solutions#consult", tint: "bg-violet-100 text-violet-700" },
  { Icon: Handshake, title: "Partnership", text: "Choose “Partnership” as the enquiry type below.", href: "#contact-form", tint: "bg-emerald-100 text-emerald-700" },
];

export default function ContactPage() {
  const tel = telHref(site.contact.phone);
  const wa = whatsappHref(site.contact.whatsapp);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to Medhavya Systems."
        intro="Tell us what you are working on. A real person reads every enquiry."
        crumbs={[{ label: "Contact" }]}
        visual={<ConversationVisual />}
        background={<HeroPhotoBackground src="/images/company/contact.jpg" position="65% 40%" />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-14 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-10">
            <ul data-reveal-group="80" className="space-y-3">
              {routes.map(({ Icon, title, text, href, tint }) => (
                <li key={title}>
                  <Link href={href} className="group flex items-center gap-4 rounded-[var(--radius-md)] border border-line bg-white p-4 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                    <span aria-hidden className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tint}`}>
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-midnight">{title}</span>
                      <span className="block text-sm text-muted">{text}</span>
                    </span>
                    <ArrowRight aria-hidden className="size-4 text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <dl className="relative space-y-5 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 text-sm shadow-[var(--shadow-panel)]">
              <AccentBar className="from-emerald-500 to-teal-400" />
              <div>
                <CardLabel as="dt" tone="primary" icon={<Clock aria-hidden className="size-4" />}>
                  Response time
                </CardLabel>
                <dd className="mt-1 pl-6 text-muted">
                  {site.contact.responseExpectation}
                  {site.contact.hours && ` Hours: ${site.contact.hours}.`}
                </dd>
              </div>
              <div>
                <CardLabel as="dt" tone="primary" icon={<Mail aria-hidden className="size-4" />}>
                  Email
                </CardLabel>
                <dd className="mt-1 pl-6 text-muted">
                  {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : "Our public email address will be published here shortly. Please use the form."}
                </dd>
              </div>
              {tel && (
                <div>
                  <CardLabel as="dt" tone="primary" icon={<Phone aria-hidden className="size-4" />}>
                  Phone
                </CardLabel>
                  <dd className="mt-1 pl-6 text-muted">
                    <a href={tel}>{site.contact.phone}</a>
                  </dd>
                </div>
              )}
              {wa && (
                <div>
                  <CardLabel as="dt" tone="primary" icon={<MessageCircle aria-hidden className="size-4" />}>
                  WhatsApp
                </CardLabel>
                  <dd className="mt-1 pl-6 text-muted">
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div id="contact-form" className="relative scroll-mt-24 overflow-hidden rounded-[var(--radius-xl)] border border-white/80 bg-white/90 p-6 shadow-[var(--shadow-lift)] backdrop-blur-md sm:p-10">
            <AccentBar className="from-primary via-electric to-cyan" />
            <h2 className="mb-8 text-xl font-semibold text-midnight">Send us a message</h2>
            <LeadForm enquiryType="General" showTypeSelect />
          </div>
        </Container>
      </section>
    </>
  );
}
