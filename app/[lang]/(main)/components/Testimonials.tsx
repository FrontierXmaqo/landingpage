import SectionHeading from "./SectionHeading";
import { TESTIMONIALS } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";

function Stars() {
  return (
    <div className="mb-3 flex gap-0.5 text-brand-orange-ink" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

// Quotes stay in the words each customer wrote; only the section heading is translated.
export default function Testimonials({ t }: { t: Dictionary["testimonials"] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow={t.eyebrow} title={t.title} />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="flex flex-col rounded-2xl border border-base-line bg-base-panel p-6 shadow-sm"
          >
            <Stars />
            <blockquote className="flex-1 text-sm leading-relaxed text-base-slate">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-base-ink">
              {t.name}
              <span className="block text-xs font-normal text-base-slate">{t.location}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
