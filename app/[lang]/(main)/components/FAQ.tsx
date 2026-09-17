import SectionHeading from "./SectionHeading";
import type { Dictionary } from "@/lib/i18n";

/**
 * Native <details> rather than React state: the accordion was the only reason
 * this section shipped as a client component, and its hydration was pure Total
 * Blocking Time for a widget the browser implements for free. `name` gives the
 * same one-at-a-time behaviour the old `open === i` state did; a browser that
 * does not support it simply lets two answers sit open at once.
 */
export default function FAQ({ t }: { t: Dictionary["faq"] }) {
  return (
    <section id="faq" className="scroll-mt-20 bg-base-bg py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-10 divide-y divide-base-line rounded-2xl border border-base-line bg-base-panel">
          {t.items.map((item, i) => (
            <details key={item.q} name="faq" open={i === 0} className="group">
              <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-base-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden className="shrink-0 text-lg text-base-slate">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-relaxed text-base-slate sm:px-6">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
