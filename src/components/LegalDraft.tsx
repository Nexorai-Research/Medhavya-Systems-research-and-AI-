import { FileWarning } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/PageHero";
import { Container } from "@/components/ui/Section";

/**
 * Legal pages are rendered as clearly-labelled drafts until a qualified reviewer approves
 * final text (Module 01 §14, Module 04 §9). Do not remove the notice without that approval.
 */
export function LegalDraft({ title, summary, sections, children }: { title: string; summary: string; sections: { heading: string; body: string }[]; children?: ReactNode }) {
  return (
    <Container className="max-w-3xl py-10 sm:py-14">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="mt-10 text-4xl font-semibold tracking-tight text-midnight">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{summary}</p>
      <div role="note" className="mt-8 flex gap-3 rounded-[var(--radius-md)] border border-amber-200 bg-warning-bg p-4 text-sm text-gold-ink">
        <FileWarning aria-hidden className="size-5 shrink-0" />
        <p>
          <strong className="font-semibold">Draft pending legal review.</strong> This page outlines what the final policy will cover. It is not legal advice and will be replaced with reviewed text before launch.
        </p>
      </div>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-semibold text-midnight">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-ink">{s.body}</p>
          </section>
        ))}
      </div>
      {children}
    </Container>
  );
}
