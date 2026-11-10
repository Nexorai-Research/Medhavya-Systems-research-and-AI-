import Link from "next/link";
import { Clock, Handshake, Mail, MessageCircle, MonitorPlay, Building2, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";
import { ConversationVisual } from "@/components/visuals/PageVisuals";
import { site } from "@/content/site";
import { LeadForm } from "@/features/leads/LeadForm";
import { telHref, whatsappHref } from "@/lib/contact-links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact Medhavya Systems about products, enterprise projects or partnerships.",
  path: "/contact",
});

const routes = [
  { Icon: MonitorPlay, title: "Product demo", text: "See a product with our team.", href: "/request-demo" },
  { Icon: Building2, title: "Enterprise project", text: "Discuss custom software or AI work.", href: "/enterprise-solutions#consult" },
  { Icon: Handshake, title: "Partnership", text: "Choose “Partnership” as the enquiry type below.", href: "#contact-form" },
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
      />
      <section className="py-14 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-10">
            <ul className="space-y-3">
              {routes.map(({ Icon, title, text, href }) => (
                <li key={title}>
                  <Link href={href} className="flex gap-4 rounded-[var(--radius-md)] border border-line bg-white p-4 transition-colors hover:border-primary">
                    <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>
                      <span className="block font-semibold text-midnight">{title}</span>
                      <span className="block text-sm text-muted">{text}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="flex items-center gap-2 font-semibold text-midnight">
                  <Clock aria-hidden className="size-4 text-muted" /> Response time
                </dt>
                <dd className="mt-1 pl-6 text-muted">
                  {site.contact.responseExpectation}
                  {site.contact.hours && ` Hours: ${site.contact.hours}.`}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 font-semibold text-midnight">
                  <Mail aria-hidden className="size-4 text-muted" /> Email
                </dt>
                <dd className="mt-1 pl-6 text-muted">
                  {site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : "Our public email address will be published here shortly. Please use the form."}
                </dd>
              </div>
              {tel && (
                <div>
                  <dt className="flex items-center gap-2 font-semibold text-midnight">
                    <Phone aria-hidden className="size-4 text-muted" /> Phone
                  </dt>
                  <dd className="mt-1 pl-6 text-muted">
                    <a href={tel}>{site.contact.phone}</a>
                  </dd>
                </div>
              )}
              {wa && (
                <div>
                  <dt className="flex items-center gap-2 font-semibold text-midnight">
                    <MessageCircle aria-hidden className="size-4 text-muted" /> WhatsApp
                  </dt>
                  <dd className="mt-1 pl-6 text-muted">
                    <a href={wa} target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div id="contact-form" className="scroll-mt-24 rounded-[var(--radius-xl)] border border-line bg-white p-6 shadow-[var(--shadow-panel)] sm:p-10">
            <h2 className="mb-8 text-xl font-semibold text-midnight">Send us a message</h2>
            <LeadForm enquiryType="General" showTypeSelect />
          </div>
        </Container>
      </section>
    </>
  );
}
