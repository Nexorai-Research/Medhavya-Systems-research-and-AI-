import { EyeOff, FileSearch, KeyRound, LockKeyhole, ServerCog, ShieldCheck, UserCheck } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { AccentBar, Container, SectionHeading } from "@/components/ui/Section";
import { ShieldVisual } from "@/components/visuals/PageVisuals";
import { Starfield } from "@/components/visuals/Starfield";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Security",
  description: "An overview of Medhavya Systems security and privacy practices.",
  path: "/security",
});

// Tints are full class names so Tailwind keeps them.
const practices = [
  { Icon: UserCheck, title: "Access control", text: "Role-based access with least privilege. Multi-factor authentication for privileged accounts where supported.", tint: "bg-blue-100 text-primary", bar: "from-primary to-electric" },
  { Icon: LockKeyhole, title: "Data protection", text: "Encryption in transit. Secrets kept in managed stores, never in source code.", tint: "bg-emerald-100 text-emerald-700", bar: "from-emerald-500 to-teal-400" },
  { Icon: FileSearch, title: "Audit trails", text: "Administrative and sensitive actions are recorded with who, what and when.", tint: "bg-violet-100 text-violet-700", bar: "from-violet-500 to-fuchsia-400" },
  { Icon: ServerCog, title: "Secure development", text: "Server-side validation, dependency and secret scanning, and security review before release.", tint: "bg-cyan/20 text-cyan-ink", bar: "from-cyan to-sky-400" },
  { Icon: EyeOff, title: "Data minimisation", text: "We collect only what a workflow needs. Website analytics never receive names, emails, phone numbers or messages.", tint: "bg-amber-100 text-amber-700", bar: "from-amber-500 to-orange-400" },
  { Icon: KeyRound, title: "Sensitive data", text: "Our marketing forms must not be used to share patient records, student data or financial credentials.", tint: "bg-rose-100 text-rose-700", bar: "from-rose-500 to-orange-400" },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero
        tone="dark"
        eyebrow="Trust center"
        title="Security and privacy, described factually."
        intro="This page describes our practices. It does not claim certifications we do not hold; when formal attestations exist, they will be listed here with their scope."
        crumbs={[{ label: "Security" }]}
        visual={<ShieldVisual />}
        backdrop={<Starfield />}
      />
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd] py-20 sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
        <Container className="relative">
          <SectionHeading eyebrow="Practices" title="How we protect systems and data" />
          <ul data-reveal-group="70" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {practices.map(({ Icon, title, text, tint, bar }) => (
              <li key={title} className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 transition-[translate,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-lift)]">
                <AccentBar className={bar} />
                <span aria-hidden className={`flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tint}`}>
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 font-semibold text-midnight">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="relative overflow-hidden border-t border-line bg-white py-16 sm:py-20">
        <Container className="relative">
          <div className="relative grid gap-8 overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-7 shadow-[var(--shadow-panel)] sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <AccentBar className="from-emerald-500 to-teal-400" />
            <div className="flex gap-5">
              <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <ShieldCheck className="size-6" strokeWidth={1.8} />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-midnight">Reporting a security concern</h2>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted">
                  If you believe you have found a vulnerability in a Medhavya system, please contact us through the form and choose “General enquiry”. Do not include exploit details or personal data in the first message; we will arrange a secure channel.
                </p>
              </div>
            </div>
            <ButtonLink href="/contact" variant="primary" arrow>
              Contact security
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
