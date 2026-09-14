import Image from "next/image";
import LeadForm from "./LeadForm";
import { OLD_SITE_IMAGES } from "@/lib/content";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function Hero({ locale, t: dict }: { locale: Locale; t: Dictionary }) {
  const t = dict.hero;
  return (
    <section className="relative overflow-hidden bg-base-bg">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <span className="section-eyebrow inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1 text-xs font-semibold uppercase text-brand-green-ink">
            {t.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-base-ink sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-base-slate sm:text-lg">
            {t.bodyLead}
            {dict.space}
            <span className="animate-credential-highlight font-bold text-brand-green-ink">
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
              className="inline-flex items-center justify-center rounded-full border border-base-line px-6 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate"
            >
              {t.secondaryCta}
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-base-line pt-6">
            {t.stats.map((s) => (
              <div key={s.label}>
                <div className="text-lg font-bold text-base-ink sm:text-xl">{s.value}</div>
                <div className="mt-0.5 text-xs text-base-slate sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="relative mt-8 hidden aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-xl sm:block">
            <Image
              src={OLD_SITE_IMAGES.heroHouse}
              alt={t.imageAlt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
            />
          </div>
        </div>

        <div className="lg:pl-4">
          <LeadForm locale={locale} t={dict.leadForm} options={dict.formOptions} />
        </div>
      </div>
    </section>
  );
}
