import { FileWarning } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/PageHero";
import { AccentBar, Container } from "@/components/ui/Section";

/**
 * Legal pages are rendered as clearly-labelled drafts until a qualified reviewer approves
 * final text (Module 01 §14, Module 04 §9). Do not remove the notice without that approval.
 */
export function LegalDraft({ title, summary, sections, children }: { title: string; summary: string; sections: { heading: string; body: string }[]; children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-canvas to-[#f1f6fd]">
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-32 size-[26rem] rounded-full bg-electric/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-32 bottom-0 size-[24rem] rounded-full bg-cyan/15 blur-3xl" />
      <Container className="relative max-w-3xl pt-5 pb-14 sm:pt-7 sm:pb-20">
        <Breadcrumbs items={[{ label: title }]} />
        <h1 className="mt-8 text-4xl font-semibold tracking-tight text-midnight">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{summary}</p>
        <div role="note" className="relative mt-8 flex gap-3 overflow-hidden rounded-[var(--radius-md)] border border-amber-200 bg-warning-bg p-4 pl-5 text-sm text-gold-ink">
          <AccentBar className="from-amber-500 to-orange-400" />
          <FileWarning aria-hidden className="mt-1 size-5 shrink-0" />
          <p className="mt-1">
            <strong className="font-semibold">Draft pending legal review.</strong> This page outlines what the final policy will cover. It is not legal advice and will be replaced with reviewed text before launch.
          </p>
        </div>
        <ol className="mt-10 space-y-4">
          {sections.map((s, i) => (
            <li key={s.heading} className="relative overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-[var(--shadow-panel)]">
              <div className="flex items-start gap-4">
                <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan font-mono text-sm font-semibold text-white shadow-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <section>
                  <h2 className="text-xl font-semibold text-midnight">{s.heading}</h2>
                  <p className="mt-2 leading-relaxed text-ink">{s.body}</p>
                </section>
              </div>
            </li>
          ))}
        </ol>
        {children}
      </Container>
    </div>
  );
}
