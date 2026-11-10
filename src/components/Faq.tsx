import { Plus } from "lucide-react";

/** Native <details> disclosure: keyboard- and screen-reader-accessible without JavaScript. */
export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.question} className="group py-1 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 text-left font-semibold text-midnight">
            {f.question}
            <Plus aria-hidden className="size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="pb-5 leading-relaxed text-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
