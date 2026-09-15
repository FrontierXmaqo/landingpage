import Image from "next/image";
import LeadForm, { type LeadFormOptionLists } from "./LeadForm";
import { OLD_SITE_IMAGES } from "@/lib/content";
import type { PublishedCustomField } from "@/lib/publishedContent";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function Hero({
  locale,
  t: dict,
  leadFormOptions,
  customFields,
}: {
  locale: Locale;
  t: Dictionary;
  leadFormOptions?: LeadFormOptionLists;
  customFields?: PublishedCustomField[];
}) {
  const t = dict.hero;
  return (
    <section className="relative overflow-hidden bg-base-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-2 lg:items-center lg:py-20">
        {/* Below lg the copy sits directly on the roof photo, full-bleed to the
            screen edges. On a phone the old white text block had nothing to
            carry it, and the photo was buried below the fold. From lg the
            original two-column layout is unchanged: white background, ink
            text, photo as a card under the stats. */}
        <div className="relative -mx-4 px-4 pb-10 pt-12 sm:-mx-6 sm:px-6 sm:pb-12 sm:pt-16 lg:mx-0 lg:p-0">
          <div className="absolute inset-0 lg:hidden">
            <Image
              src={OLD_SITE_IMAGES.heroHouse}
              alt={t.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 1px, 100vw"
              priority
            />
            <div className="hero-scrim absolute inset-0" />
          </div>

          <div className="relative">
            <span className="section-eyebrow inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1 text-xs font-semibold uppercase text-brand-green-ink">
              {t.eyebrow}
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-base-ink">
              {t.title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/90 sm:text-lg lg:text-base-slate">
              {t.bodyLead}
              {dict.space}
              <span className="animate-credential-highlight font-bold text-brand-green-tint lg:text-brand-green-ink">
                {t.bodyHighlight}
              </span>
              {t.bodyTail}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
              >
                {t.primaryCta}
              </a>
              <a
                href="#packages"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:border-white lg:border-base-line lg:text-base-ink lg:hover:border-base-slate"
              >
                {t.secondaryCta}
              </a>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/30 pt-6 lg:border-base-line">
              {t.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-lg font-bold text-white sm:text-xl lg:text-base-ink">{s.value}</div>
                  <div className="mt-0.5 text-xs text-white/80 sm:text-sm lg:text-base-slate">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Same photo as the backdrop above, but the two live at different
                points in the flow, so each breakpoint needs its own element.
                `display: none` does not stop a download, hence the 1px `sizes`
                on whichever one is hidden: the browser picks the smallest
                candidate for it and only the visible one costs bandwidth. */}
            <div className="relative mt-8 hidden aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-xl lg:block">
              <Image
                src={OLD_SITE_IMAGES.heroHouse}
                alt={t.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1023px) 1px, 560px"
              />
            </div>
          </div>
        </div>

        <div className="lg:pl-4">
          <LeadForm locale={locale} t={dict.leadForm} labels={dict.formOptions} options={leadFormOptions} customFields={customFields} />
        </div>
      </div>
    </section>
  );
}
