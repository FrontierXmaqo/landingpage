import ScrollReveal from "../ScrollReveal";
import SectionTag from "../SectionTag";
import type { PublishedFaqItem } from "@/lib/publishedContent";
import type { HomeCopy } from "./copy";

/**
 * Native <details> with a shared `name`, the same approach the residential
 * FAQ uses: one answer open at a time, no hydration, and the browser's own
 * accordion semantics for screen readers and in-page find.
 *
 * Items are the CMS-managed residential set, so marketing edits them in one
 * place and they arrive here already translated. The JSON-LD below is built
 * from the same array, so the structured data can never drift from what the
 * page actually shows.
 */
export default function HomeFaq({ t, items }: { t: HomeCopy["faq"]; items: PublishedFaqItem[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section id="faq" className="scroll-mt-20 bg-base-bg py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 sm:px-6 lg:grid-cols-[22rem_1fr] lg:gap-16">
        <ScrollReveal className="grid gap-5 lg:sticky lg:top-24">
          <SectionTag>{t.eyebrow}</SectionTag>
          <h2 className="text-2xl font-bold leading-tight text-base-ink sm:text-3xl">{t.title}</h2>
          <p className="text-[15px] leading-relaxed text-base-slate">{t.body}</p>
          <a
            href="#consultation"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-base-line bg-base-panel px-6 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate"
          >
            {t.cta}
            <span aria-hidden>&rarr;</span>
          </a>
        </ScrollReveal>

        <ScrollReveal className="border-t border-base-line">
          {items.map((item, i) => (
            <details key={item.q} name="home-faq" open={i === 0} className="group border-b border-base-line">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-[18px] text-[17px] font-semibold tracking-tight text-base-ink transition hover:text-brand-orange-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-base-line text-base leading-none text-base-slate transition group-open:border-base-ink group-open:bg-base-ink group-open:text-white"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">&minus;</span>
                </span>
              </summary>
              <div className="max-w-[62ch] pb-[22px] text-[15px] leading-relaxed text-base-slate">{item.a}</div>
            </details>
          ))}
        </ScrollReveal>
      </div>

      <script
        type="application/ld+json"
        // Built from `items` above, so the markup and the structured data
        // are the same content by construction.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
