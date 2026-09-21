import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import { BESS_BENEFIT_ICONS } from "./icons";
import HiddenChargesButton from "./HiddenChargesButton";
import BessFlowDiagram from "./BessFlowDiagram";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/bess">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.bessTitle,
    description: t.bessDescription,
    alternates: {
      canonical: localePath(lang, "/bess"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/bess")])),
    },
  };
}

const buttonPrimary =
  "inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95";
const buttonGhost =
  "inline-flex items-center justify-center rounded-full border border-base-line px-7 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate";

export default async function BessPage({ params }: PageProps<"/[lang]/bess">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.bess;
  // BESS has no lead form of its own (the hero shows the battery visual
  // instead), so every CTA here routes to the home page's #assessment form —
  // the same pattern About and ATAP already use.
  const home = (hash: string) => localePath(lang, `/${hash}`);

  return (
    <div data-theme="bess" className="contents">
      <Header locale={lang} t={dict} ctaHref={home("#assessment")} />
      <main className="bess-page-wash flex-1 overflow-x-clip">
        {/* ---------- 1. Hero ---------- */}
        <section className="relative overflow-hidden pb-20 pt-14 sm:pt-16">
          <div aria-hidden className="atap-hero-glow atap-hero-dots pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8">
            <div>
              <SectionTag>{t.eyebrow}</SectionTag>
              <h1 className="mt-5 max-w-lg text-4xl font-extrabold leading-[1.1] tracking-tight text-base-ink sm:text-5xl">
                {t.heroTitleLead}
                {dict.space}
                <span className="text-brand-orange-ink">{t.heroTitleAccent}</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-base-slate sm:text-lg">{t.heroBody}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href={home("#assessment")} className={buttonPrimary}>
                  {t.heroCtaPrimary}
                </Link>
                <a href="#solution" className={buttonGhost}>
                  {t.heroCtaSecondary}
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {t.heroTrust.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-base-line bg-base-panel px-3 py-1 text-xs font-semibold text-base-slate"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <BessFlowDiagram t={t.heroVisual} />
          </div>
        </section>

        {/* ---------- 2. The Problem ---------- */}
        <section id="problem" className="scroll-mt-20 bg-base-panel/70 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <ScrollReveal>
              <div className="flex justify-center">
                <SectionTag>{t.problemTag}</SectionTag>
              </div>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.problemTitle}</h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-base-slate">{t.problemBody}</p>
            </ScrollReveal>

            <ScrollReveal delayMs={80} className="mx-auto mt-10 max-w-xl">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="rounded-2xl border border-[#e3b7ad] bg-base-bg p-5 text-center sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-[#a45140]">{t.problemBeforeLabel}</p>
                  <p className="mt-2 text-2xl font-extrabold text-base-ink sm:text-3xl">{t.problemBeforeAmt}</p>
                </div>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-base-slate">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
                <div className="rounded-2xl border border-brand-green/40 bg-brand-green-tint p-5 text-center sm:p-6">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-green-ink">{t.problemAfterLabel}</p>
                  <p className="mt-2 text-2xl font-extrabold text-brand-green-ink sm:text-3xl">{t.problemAfterAmt}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-base-slate">{t.problemCompareCaption}</p>
              <div className="mt-6 flex justify-center">
                <HiddenChargesButton />
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {t.problemFacts.map((fact, i) => (
                <ScrollReveal key={fact.stat} delayMs={i * 60} className="h-full rounded-2xl border border-base-line bg-base-bg p-5 text-center">
                  <p className="text-lg font-extrabold text-brand-green-ink">{fact.stat}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-base-slate">{fact.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 3. What is BESS ---------- */}
        <section id="what-is-bess" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.whatTag}</SectionTag>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.whatTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-slate">{t.whatBody}</p>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ScrollReveal delayMs={80} className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-sm">
                <span className="inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-green-ink">
                  {t.chargeBadge}
                </span>
                <h3 className="mt-4 text-lg font-bold text-base-ink">{t.chargeTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-slate">{t.chargeBody}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-line">
                  <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#4ade80] to-[#16a34a]" />
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={140} className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-sm">
                <span className="inline-flex items-center rounded-full bg-brand-orange-tint px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-orange-ink">
                  {t.dischargeBadge}
                </span>
                <h3 className="mt-4 text-lg font-bold text-base-ink">{t.dischargeTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-slate">{t.dischargeBody}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-line">
                  <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-[#fde047] to-[#d97706]" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ---------- 5. How BESS Works ---------- */}
        <section id="how-it-works" className="scroll-mt-20 bg-base-panel/70 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.flowTag}</SectionTag>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.flowTitle}</h2>
            </ScrollReveal>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.flowSteps.map((step, i) => (
                <ScrollReveal
                  key={step.title}
                  delayMs={i * 70}
                  className="h-full rounded-2xl border border-base-line bg-base-bg p-6 text-center"
                >
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand-green-deep text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-sm font-bold text-base-ink">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-base-slate">{step.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 4. Key Benefits ---------- */}
        <section id="benefits" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTag>{t.benefitsTag}</SectionTag>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.benefitsTitle}</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.benefits.map((benefit, i) => {
                const Icon = BESS_BENEFIT_ICONS[i];
                return (
                  <ScrollReveal key={benefit.title} delayMs={i * 60}>
                    <div className="h-full rounded-2xl border border-base-line bg-base-panel p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-tint text-brand-green-deep">
                        <Icon />
                      </span>
                      <h3 className="mt-5 text-lg font-bold text-base-ink">{benefit.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-base-slate">{benefit.body}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- 6. MAQO BESS Solution ---------- */}
        <section id="solution" className="scroll-mt-20 bg-base-panel/70 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.solutionTag}</SectionTag>
              <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.solutionTitle}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-slate">{t.solutionBody}</p>
              <div className="mt-10 border-t border-base-line">
                {t.solutionStages.map((stage, i) => (
                  <div
                    key={stage.title}
                    className="grid gap-1.5 border-b border-base-line py-6 sm:grid-cols-[2.5rem_15rem_1fr] sm:items-baseline sm:gap-6"
                  >
                    <span className="text-sm font-extrabold tabular-nums text-brand-green-ink">0{i + 1}</span>
                    <h3 className="text-lg font-bold text-base-ink">{stage.title}</h3>
                    <p className="text-sm leading-relaxed text-base-slate">{stage.body}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ---------- 7. Business Model / Zero-CAPEX ---------- */}
        <section id="model" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.modelTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.modelTitle}</h2>
            </ScrollReveal>
            <div className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ScrollReveal delayMs={80} className="rounded-2xl bg-brand-green-deep p-7 text-white">
                <p className="text-xs font-bold uppercase tracking-wide text-white/75">{t.modelBuyKicker}</p>
                <h3 className="mt-2 text-lg font-extrabold">{t.modelBuyTitle}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-white/90">{t.modelBuyBody}</p>
                <ul className="mt-5 flex flex-col gap-2 text-sm">
                  {t.modelBuyPoints.map((point) => (
                    <li key={point} className="flex items-baseline gap-2">
                      <span aria-hidden className="text-white/80">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
              <ScrollReveal delayMs={140} className="rounded-2xl border border-base-line bg-base-panel p-7">
                <p className="text-xs font-bold uppercase tracking-wide text-base-slate">{t.modelZeroKicker}</p>
                <h3 className="mt-2 text-lg font-extrabold text-base-ink">{t.modelZeroTitle}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-base-slate">{t.modelZeroBody}</p>
                <ul className="mt-5 flex flex-col gap-2 text-sm text-base-ink">
                  {t.modelZeroPoints.map((point) => (
                    <li key={point} className="flex items-baseline gap-2">
                      <span aria-hidden className="text-brand-green-ink">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ---------- 8. Final CTA ---------- */}
        <section className="bg-brand-green-deep py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl">{t.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">{t.ctaBody}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={home("#assessment")}
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[13px] font-bold text-brand-green-deep shadow-sm transition hover:brightness-95"
              >
                {t.ctaPrimary}
              </Link>
              <Link
                href={home("#assessment")}
                className="inline-flex items-center justify-center rounded-full border border-white/60 px-7 py-3.5 text-[13px] font-bold text-white transition hover:border-white"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer
        locale={lang}
        t={dict.footer}
        nav={dict.header.nav}
        explore={[
          { label: "The Problem", href: "#problem" },
          { label: "What Is BESS", href: "#what-is-bess" },
          { label: "How It Works", href: "#how-it-works" },
          { label: "Key Benefits", href: "#benefits" },
          { label: "Business Model", href: "#model" },
        ]}
      />
    </div>
  );
}
