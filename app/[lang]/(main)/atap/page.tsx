import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import { OLD_SITE_IMAGES } from "@/lib/content";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/atap">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.atapTitle,
    description: t.atapDescription,
    alternates: {
      canonical: localePath(lang, "/atap"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/atap")])),
    },
  };
}

const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95";
const buttonGhost =
  "inline-flex items-center justify-center rounded-full border border-base-line px-7 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate";

export default async function AtapPage({ params }: PageProps<"/[lang]/atap">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.atap;
  const s = dict.space;
  const home = (hash: string) => localePath(lang, `/${hash}`);

  return (
    <div data-theme="atap" className="contents">
      <Header locale={lang} t={dict} ctaHref={home("#assessment")} />
      <main className="flex-1 overflow-x-clip bg-base-bg">
        {/* Hero: a mock TNB bill with the ATAP credit applied stands in for a
            stock photo — it makes the value proposition concrete instead of
            generic rooftop imagery. A soft glow + dot-grid ("the grid") sit
            behind it for texture. */}
        <section className="relative overflow-hidden pb-24 pt-14 sm:pt-16">
          <div aria-hidden className="atap-hero-glow atap-hero-dots pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
            <div>
              <span className="section-eyebrow inline-flex items-center gap-2 rounded-full bg-brand-green-tint px-3 py-1 text-xs font-semibold uppercase text-brand-green-ink">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand-green-ink" />
                {t.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-base-ink sm:text-5xl lg:text-[3.35rem]">
                {t.heroTitleLead}
                {s}
                <span className="text-brand-orange-ink">{t.heroTitleAccent}</span>
                {s}
                {t.heroTitleTail}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-base-slate sm:text-lg">{t.heroBody}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#compare" className={buttonPrimary}>
                  {t.heroCtaPrimary}
                </a>
                <a href="#how" className={buttonGhost}>
                  {t.heroCtaSecondary}
                </a>
              </div>
              <p className="mt-4 text-xs text-base-slate">{t.heroSources}</p>
            </div>

            {/* Mock TNB e-bill with the export credit line highlighted */}
            <div className="relative overflow-hidden rounded-2xl border border-base-line bg-base-panel pb-20 shadow-xl">
              <div className="flex items-center justify-between bg-base-ink px-6 py-4 text-white">
                <span className="text-[13px] font-extrabold tracking-wide">{t.billTnb}</span>
                <span className="text-[11px] text-white/60">{t.billIllustrative}</span>
              </div>
              <div className="px-6 pb-1 pt-5">
                <div className="flex items-baseline justify-between py-2 text-sm">
                  <span className="text-base-slate">{t.billUsage}</span>
                  <span className="font-semibold tabular-nums text-base-ink">{t.billUsageAmt}</span>
                </div>
                <div className="flex items-baseline justify-between py-2 text-sm">
                  <span className="text-base-slate">{t.billService}</span>
                  <span className="font-semibold tabular-nums text-base-ink">{t.billServiceAmt}</span>
                </div>
                <div className="flex items-baseline justify-between py-2 text-sm">
                  <span className="font-semibold text-brand-green-ink">{t.billCredit}</span>
                  <span className="font-bold tabular-nums text-brand-green-ink">{t.billCreditAmt}</span>
                </div>
                <div className="my-2 border-t border-dashed border-base-line" />
                <div className="flex items-baseline justify-between pt-3.5 pb-1">
                  <span className="text-[15px] font-bold text-base-ink">{t.billTotal}</span>
                  <span className="text-xl font-extrabold tabular-nums text-base-ink">{t.billTotalAmt}</span>
                </div>
              </div>
              <span className="mx-6 mb-5 mt-2 inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1.5 text-xs font-bold text-brand-green-ink">
                {t.billSavedChip}
              </span>
              <div className="absolute inset-x-4 bottom-4 z-10 flex items-center gap-4 rounded-2xl border border-base-line bg-base-panel p-4 shadow-lg sm:inset-x-5">
                <div>
                  <div className="text-2xl font-extrabold tabular-nums leading-none text-base-ink">{t.floatContractVal}</div>
                  <div className="mt-1 text-xs text-base-slate">{t.floatContract}</div>
                </div>
                <div className="w-px self-stretch bg-base-line" />
                <div>
                  <div className="text-2xl font-extrabold tabular-nums leading-none text-base-ink">{t.floatHomeownersVal}</div>
                  <div className="mt-1 text-xs text-base-slate">{t.floatHomeowners}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stat strip floats up to overlap the hero's bottom edge, so the
            seam between sections reads as one continuous moment. */}
        <div className="relative z-10 -mt-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-base-line bg-base-line shadow-xl sm:grid-cols-4">
              {t.stats.map((stat, i) => (
                <div
                  key={stat.value}
                  className="border-t-[3px] bg-base-panel p-5"
                  style={{ borderTopColor: i % 2 === 0 ? "var(--color-brand-green)" : "var(--color-brand-orange)" }}
                >
                  <div className="text-[28px] font-extrabold tabular-nums leading-none tracking-tight text-base-ink">{stat.value}</div>
                  <div className="mt-1.5 text-xs leading-relaxed text-base-slate">{stat.label}</div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>

        {/* What is ATAP: plain-language explainer + the one thing that's
            genuinely different from NEM (the MAQ export cap). */}
        <section id="what-is-atap" className="scroll-mt-20 bg-base-panel py-20 sm:py-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
            <ScrollReveal>
              <SectionTag>{t.startTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.startTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">{t.startBody1}</p>
              <p className="mt-4 text-base leading-relaxed text-base-slate">{t.startBody2}</p>
            </ScrollReveal>
            <ScrollReveal delayMs={100} className="rounded-2xl border border-brand-orange/30 bg-brand-orange-tint p-6">
              <p className="flex items-center gap-2.5 text-sm font-bold text-brand-orange-ink">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange-deep text-xs font-extrabold text-white">
                  !
                </span>
                {t.calloutTitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-base-ink">{t.calloutBody}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* How your bill credit is earned: 4 steps beside the flow diagram */}
        <section id="how" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <ScrollReveal>
              <SectionTag>{t.mechTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.mechTitle}</h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">{t.mechBody}</p>
              <div className="mt-10 border-t border-base-line">
                {t.mechSteps.map((step, i) => (
                  <div key={step.title} className="grid gap-1.5 border-b border-base-line py-6 sm:grid-cols-[2.5rem_11rem_1fr] sm:items-baseline sm:gap-6">
                    <span className="text-sm font-extrabold tabular-nums text-brand-orange-ink">0{i + 1}</span>
                    <h3 className="text-lg font-bold text-base-ink">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-base-slate">{step.body}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={120} className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-sm">
                <svg viewBox="0 0 400 230" role="img" aria-label={t.diagramAlt} className="block h-auto w-full">
                  <circle cx="70" cy="42" r="20" fill="var(--color-brand-orange)" />
                  <g stroke="var(--color-brand-orange)" strokeWidth="3" strokeLinecap="round">
                    <line x1="70" y1="8" x2="70" y2="0" />
                    <line x1="70" y1="84" x2="70" y2="76" />
                    <line x1="36" y1="42" x2="28" y2="42" />
                    <line x1="112" y1="42" x2="104" y2="42" />
                    <line x1="45" y1="17" x2="39" y2="11" />
                    <line x1="95" y1="67" x2="101" y2="73" />
                    <line x1="95" y1="17" x2="101" y2="11" />
                    <line x1="45" y1="67" x2="39" y2="73" />
                  </g>
                  <line x1="82" y1="58" x2="150" y2="86" stroke="var(--color-brand-orange)" strokeWidth="2.5" strokeDasharray="4 5" />
                  <g transform="translate(120,86)">
                    <rect x="0" y="0" width="140" height="46" rx="6" fill="var(--color-brand-green-tint)" stroke="var(--color-brand-green-ink)" strokeWidth="1.5" />
                    <line x1="35" y1="0" x2="35" y2="46" stroke="var(--color-brand-green-ink)" strokeWidth="1.2" opacity=".5" />
                    <line x1="70" y1="0" x2="70" y2="46" stroke="var(--color-brand-green-ink)" strokeWidth="1.2" opacity=".5" />
                    <line x1="105" y1="0" x2="105" y2="46" stroke="var(--color-brand-green-ink)" strokeWidth="1.2" opacity=".5" />
                    <line x1="0" y1="23" x2="140" y2="23" stroke="var(--color-brand-green-ink)" strokeWidth="1.2" opacity=".5" />
                  </g>
                  <text x="190" y="149" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--color-base-slate)" fontFamily="var(--font-sans)">
                    {t.diagramSolarPanels}
                  </text>
                  <path d="M 150 132 C 130 165, 95 178, 70 178" fill="none" stroke="var(--color-brand-green-ink)" strokeWidth="2.5" className="atap-flow-dash" />
                  <g transform="translate(35,178)">
                    <path d="M0 20 L20 3 L40 20 V40 H0 Z" fill="var(--color-base-panel)" stroke="var(--color-brand-green-ink)" strokeWidth="2" />
                    <rect x="14" y="26" width="12" height="14" fill="var(--color-brand-green-ink)" />
                  </g>
                  <text x="35" y="222" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--color-brand-green-ink)" fontFamily="var(--font-sans)">
                    {t.diagramYourHome}
                  </text>
                  <path d="M 260 132 C 300 160, 330 168, 355 178" fill="none" stroke="var(--color-brand-orange-deep)" strokeWidth="2.5" className="atap-flow-dash" />
                  <g transform="translate(330,178)" stroke="var(--color-brand-orange-deep)" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <line x1="0" y1="40" x2="0" y2="6" />
                    <line x1="-14" y1="18" x2="14" y2="18" />
                    <line x1="-10" y1="0" x2="10" y2="0" />
                    <line x1="-6" y1="-7" x2="6" y2="-7" />
                  </g>
                  <text x="330" y="222" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--color-brand-orange-ink)" fontFamily="var(--font-sans)">
                    {t.diagramTnbGrid}
                  </text>
                </svg>
                <div className="mt-4 flex justify-between gap-3 border-t border-dashed border-base-line pt-4">
                  <div className="flex-1 text-center">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-base-slate">{t.diagramCaption1Label}</div>
                    <div className="mt-0.5 text-sm font-bold text-brand-green-ink">{t.diagramCaption1Value}</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-[11px] font-bold uppercase tracking-wide text-base-slate">{t.diagramCaption2Label}</div>
                    <div className="mt-0.5 text-sm font-bold text-brand-orange-ink">{t.diagramCaption2Value}</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ATAP vs NEM comparison table */}
        <section id="compare" className="scroll-mt-20 bg-base-panel py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.compareTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                {t.compareTitleLead}
                {s}
                <span className="text-brand-orange-ink">{t.compareTitleAccent}</span>
                {s}
                {t.compareTitleTail}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-slate">{t.compareBody}</p>
            </ScrollReveal>
            <ScrollReveal delayMs={100} className="mt-10 overflow-x-auto rounded-2xl border border-base-line shadow-sm">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="bg-base-bg">
                    <th className="p-0" />
                    <th className="border-b border-base-line px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-base-slate">
                      {t.compareColNem} <span className="ml-2 rounded-full bg-base-line px-2 py-0.5 text-[11px] font-bold text-base-slate">{t.compareColNemPill}</span>
                    </th>
                    <th className="border-b border-base-line px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-brand-green-ink">
                      {t.compareColAtap} <span className="ml-2 rounded-full bg-brand-green-tint px-2 py-0.5 text-[11px] font-bold text-brand-green-ink">{t.compareColAtapPill}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.compareRows.map((row, i) => (
                    <tr key={row.label} className={i < t.compareRows.length - 1 ? "border-b border-base-line" : ""}>
                      <td className="px-5 py-4 align-top font-semibold text-base-slate">{row.label}</td>
                      <td className="px-5 py-4 align-top leading-relaxed text-base-slate">{row.nem}</td>
                      <td className="px-5 py-4 align-top font-medium leading-relaxed text-base-ink">{row.atap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollReveal>
          </div>
        </section>

        {/* Eligibility: real installs banner + Domestic vs Non-domestic cards */}
        <section id="eligibility" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.eligTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.eligTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-slate">{t.eligBody}</p>
            </ScrollReveal>
            <ScrollReveal delayMs={80} className="relative mt-9 aspect-[21/8] w-full overflow-hidden rounded-2xl shadow-sm">
              <Image src={OLD_SITE_IMAGES.gallery[0]} alt={t.eligBannerAlt} fill className="object-cover" sizes="(min-width: 1024px) 960px, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-base-ink/65 via-base-ink/0 to-transparent" />
              <p className="absolute bottom-3.5 left-5 text-xs font-semibold text-white">{t.eligBannerCaption}</p>
            </ScrollReveal>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ScrollReveal delayMs={100} className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-base-slate">{t.eligHomesTag}</p>
                <h3 className="mt-2 text-xl font-extrabold text-base-ink">{t.eligHomesTitle}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {t.eligHomesItems.map((item) => (
                    <li key={item.kw} className="flex gap-2.5 text-sm leading-relaxed">
                      <span className="min-w-[78px] shrink-0 font-extrabold text-brand-green-ink">{item.kw}</span>
                      <span className="text-base-ink">{item.body}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-dashed border-base-line pt-4 text-xs leading-relaxed text-base-slate">{t.eligHomesFoot}</p>
              </ScrollReveal>
              <ScrollReveal delayMs={160} className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wide text-base-slate">{t.eligBizTag}</p>
                <h3 className="mt-2 text-xl font-extrabold text-base-ink">{t.eligBizTitle}</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {t.eligBizItems.map((item) => (
                    <li key={item.kw} className="flex gap-2.5 text-sm leading-relaxed">
                      <span className="min-w-[78px] shrink-0 font-extrabold text-brand-green-ink">{item.kw}</span>
                      <span className="text-base-ink">{item.body}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-dashed border-base-line pt-4 text-xs leading-relaxed text-base-slate">{t.eligBizFoot}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Applying for ATAP, step by step */}
        <section className="bg-base-panel py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.startedTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.startedTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-slate">{t.startedBody}</p>
              <div className="mt-10 border-t border-base-line">
                {t.startedSteps.map((step, i) => (
                  <div key={step.title} className="grid gap-1.5 border-b border-base-line py-6 sm:grid-cols-[2.5rem_13rem_1fr] sm:items-baseline sm:gap-6">
                    <span className="text-sm font-extrabold tabular-nums text-brand-orange-ink">0{i + 1}</span>
                    <h3 className="text-lg font-bold text-base-ink">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-base-slate">{step.body}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Financing: lease vs direct purchase */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.finTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.finTitle}</h2>
            </ScrollReveal>
            <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ScrollReveal delayMs={80} className="rounded-2xl bg-brand-green-deep p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-wide text-white/75">{t.finLeaseKicker}</p>
                <h3 className="mt-2 text-lg font-extrabold">{t.finLeaseTitle}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/90">{t.finLeaseBody}</p>
              </ScrollReveal>
              <ScrollReveal delayMs={140} className="rounded-2xl border border-base-line bg-base-panel p-6">
                <p className="text-xs font-bold uppercase tracking-wide text-base-slate">{t.finBuyKicker}</p>
                <h3 className="mt-2 text-lg font-extrabold text-base-ink">{t.finBuyTitle}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-base-slate">{t.finBuyBody}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 bg-base-panel py-20 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.faqTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.faqTitle}</h2>
            </ScrollReveal>
            <div className="mt-10 border-t border-base-line">
              {t.faq.map((item, i) => (
                <ScrollReveal key={item.q} delayMs={i * 50}>
                  <details open={i === 0} className="group border-b border-base-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-base font-bold text-base-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green-ink [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span aria-hidden className="shrink-0 text-2xl font-light leading-none text-brand-orange-ink transition-transform duration-300 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-5 text-sm leading-relaxed text-base-slate">{item.a}</p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <ScrollReveal className="rounded-3xl bg-brand-orange-tint px-6 py-14 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-base-ink sm:text-3xl">{t.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-base-slate sm:text-base">{t.ctaBody}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href={home("#assessment")} className={buttonPrimary}>
                {t.ctaButton}
              </Link>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer
        locale={lang}
        t={dict.footer}
        nav={dict.header.nav}
        explore={[
          { label: "What Is ATAP", href: "#what-is-atap" },
          { label: "How It Works", href: "#how" },
          { label: "ATAP vs. NEM", href: "#compare" },
          { label: "Eligibility", href: "#eligibility" },
          { label: "FAQ", href: "#faq" },
        ]}
      />
    </div>
  );
}
