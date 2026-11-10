import { EyeOff, FileSearch, KeyRound, LockKeyhole, ServerCog, ShieldCheck, UserCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Container, SectionHeading } from "@/components/ui/Section";
import { ShieldVisual } from "@/components/visuals/PageVisuals";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Security",
  description: "An overview of Medhavya Systems security and privacy practices.",
  path: "/security",
});

const practices = [
  { Icon: UserCheck, title: "Access control", text: "Role-based access with least privilege. Multi-factor authentication for privileged accounts where supported." },
  { Icon: LockKeyhole, title: "Data protection", text: "Encryption in transit. Secrets kept in managed stores, never in source code." },
  { Icon: FileSearch, title: "Audit trails", text: "Administrative and sensitive actions are recorded with who, what and when." },
  { Icon: ServerCog, title: "Secure development", text: "Server-side validation, dependency and secret scanning, and security review before release." },
  { Icon: EyeOff, title: "Data minimisation", text: "We collect only what a workflow needs. Website analytics never receive names, emails, phone numbers or messages." },
  { Icon: KeyRound, title: "Sensitive data", text: "Our marketing forms must not be used to share patient records, student data or financial credentials." },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust center"
        title="Security and privacy, described factually."
        intro="This page describes our practices. It does not claim certifications we do not hold; when formal attestations exist, they will be listed here with their scope."
        crumbs={[{ label: "Security" }]}
        visual={<ShieldVisual />}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="Practices" title="How we protect systems and data" />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {practices.map(({ Icon, title, text }) => (
              <li key={title} className="bg-white p-7">
                <Icon aria-hidden className="size-6 text-primary" strokeWidth={1.6} />
                <h3 className="mt-4 font-semibold text-midnight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="border-t border-line bg-white py-16 sm:py-20">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-5">
            <ShieldCheck aria-hidden className="size-8 shrink-0 text-cyan-ink" />
            <div>
              <h2 className="text-xl font-semibold text-midnight">Reporting a security concern</h2>
              <p className="mt-2 max-w-2xl leading-relaxed text-muted">
                If you believe you have found a vulnerability in a Medhavya system, please contact us through the form and choose “General enquiry”. Do not include exploit details or personal data in the first message; we will arrange a secure channel.
              </p>
            </div>
          </div>
          <ButtonLink href="/contact" variant="secondary">
            Contact security
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
