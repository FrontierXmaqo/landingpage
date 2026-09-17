import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Achievements from "../components/Achievements";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import { OLD_SITE_IMAGES } from "@/lib/content";
import { HTML_LANG, LOCALES, fill, getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.aboutTitle,
    description: t.aboutDescription,
    alternates: {
      canonical: localePath(lang, "/about"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/about")])),
    },
  };
}

const gallery = OLD_SITE_IMAGES.gallery;

const GROUP = [
  "Maqo Engineering Sdn Bhd",
  "Xfiniti Energy Sdn Bhd",
  "Maqo Technologies Sdn Bhd",
  "Ecosensa Technologies (AiOPC.bz)",
  "SRM Selambau",
  "Maqo Holdings",
  "MAQO RE OPC",
];
const groupTrack = [...GROUP, ...GROUP];

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.about;
  const s = dict.space;
  const home = (hash: string) => localePath(lang, `/${hash}`);

  return (
    <div data-theme="about" className="contents">
      <Header locale={lang} t={dict} ctaHref={home("#assessment")} />
      <main className="flex-1 overflow-x-clip bg-base-panel">
        {/* Hero: full-bleed real installation photo, gradient overlay for legibility, floating stat card breaks the frame */}
        <section className="relative isolate h-[560px] w-full sm:h-[640px]">
          <Image
            src={OLD_SITE_IMAGES.heroHouse}
            alt={t.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base-ink/95 via-base-ink/75 to-base-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-base-ink/70 via-transparent to-transparent" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24">
            <span className="section-eyebrow inline-flex w-fit items-center rounded-full bg-base-panel/10 px-3 py-1 text-xs font-semibold uppercase text-white ring-1 ring-white/20 backdrop-blur-sm">
              {t.heroEyebrow}
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {t.heroTitleLead}
              {s}
              <span className="text-brand-orange-ink">{t.heroTitleAccent}</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
              {t.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={home("#assessment")}
                className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
              >
                {t.heroCta}
              </Link>
            </div>
          </div>

          <div className="absolute -bottom-9 right-4 z-20 hidden w-60 rounded-2xl bg-base-panel p-5 shadow-xl sm:right-8 sm:block lg:right-16">
            <p className="text-3xl font-bold text-base-ink">1,000+</p>
            <p className="mt-1 text-sm text-base-slate">{t.heroStatLabel}</p>
          </div>
        </section>

        <div className="pt-9 sm:pt-9" />
        <Achievements t={dict.achievements} />

        {/* Who we are: alternating asymmetric photo/text rows */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid items-center gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-14">
              <ScrollReveal>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-green-ink">
                  {t.whoKicker}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-base-ink sm:text-3xl">
                  {t.whoTitleLead}
                  {t.whoTitleLead && s}
                  <span className="text-brand-orange-ink">MAQO</span>
                  {t.whoTitleTail}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
                  {t.whoBody1}
                </p>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
                  {t.whoBody2}
                </p>
              </ScrollReveal>
              <ScrollReveal delayMs={120}>
                <div className="relative mx-auto w-full max-w-xs sm:ml-auto sm:mr-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg sm:rotate-2">
                    <Image
                      src={gallery[0]}
                      alt={t.whoImageAlt}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(min-width: 640px) 320px, 80vw"
                    />
                  </div>
                  <div className="absolute bottom-5 -left-4 z-10 rounded-xl bg-base-panel px-4 py-2.5 shadow-xl sm:-left-6">
                    <p className="text-sm font-bold text-base-ink">{t.whoBadgeTitle}</p>
                    <p className="text-xs text-base-slate">{t.whoBadgeBody}</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="mt-16 grid items-center gap-10 sm:grid-cols-[0.9fr_1.1fr] sm:gap-14">
              <ScrollReveal className="order-2 sm:order-1">
                <div className="relative mx-auto w-full max-w-xs sm:mx-0">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg sm:-rotate-2">
                    <Image
                      src={gallery[1]}
                      alt={t.qualityImageAlt}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="(min-width: 640px) 320px, 80vw"
                    />
                  </div>
                  <div className="absolute bottom-5 -right-4 z-10 rounded-xl bg-base-panel px-4 py-2.5 shadow-xl sm:-right-6">
                    <p className="text-sm font-bold text-base-ink">500+</p>
                    <p className="text-xs text-base-slate">{t.qualityBadgeBody}</p>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delayMs={120} className="order-1 sm:order-2">
                <p className="text-sm font-bold uppercase tracking-wide text-brand-green-ink">
                  {t.qualityKicker}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-base-ink sm:text-3xl">
                  <span className="text-brand-orange-ink">{t.qualityTitleAccent}</span>
                  {t.qualityTitleTail}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
                  {t.qualityBody1}
                </p>
                <p className="mt-4 text-base leading-relaxed text-base-slate">
                  {t.qualityBody2}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Founder quote: real photo, brand-green overlay locked to full contrast, oversized quote mark */}
        <section className="relative overflow-hidden bg-brand-green-deep py-20 sm:py-24">
          <Image
            src={gallery[2]}
            alt=""
            fill
            aria-hidden
            className="object-cover opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-green-deep/90" />
          <ScrollReveal className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <span aria-hidden className="block text-6xl font-bold leading-none text-white/25 sm:text-7xl">
              &ldquo;
            </span>
            <p className="-mt-6 text-xl font-semibold leading-relaxed text-white sm:text-2xl">
              {t.quote}
            </p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-white/70">
              {t.quoteAuthor}
            </p>
          </ScrollReveal>
        </section>

        {/* Team: the real crew, photographed. The strongest trust signal we have. */}
        <section className="bg-base-bg py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>{t.teamTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                {t.teamTitleLead}
                {s}
                <span className="text-brand-orange-ink">{t.teamTitleAccent}</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                {t.teamBody1}
              </p>
              <p className="mt-4 text-base leading-relaxed text-base-slate">
                {t.teamBody2}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  href={home("#assessment")}
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
                >
                  {t.teamCta}
                </Link>
                <a
                  href="#standards"
                  className="inline-flex items-center justify-center rounded-full border border-base-line px-7 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate"
                >
                  {t.teamLicencesCta}
                </a>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delayMs={120} className="mx-auto mt-12 max-w-6xl px-4 sm:px-6">
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-xl sm:aspect-[2/1]">
              <Image
                src="/maqo-team.png"
                alt={t.teamImageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1152px) 1104px, 100vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-base-ink/80 to-transparent" />
              <p className="absolute bottom-5 left-5 text-sm font-semibold text-white sm:left-7">
                {t.teamCaption}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Core values: an editorial index, not another card grid */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>{t.valuesTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                {t.valuesTitleLead}
                {s}
                <span className="text-brand-orange-ink">{t.valuesTitleAccent}</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                {t.valuesBody}
              </p>
            </ScrollReveal>
            <div className="mt-12 border-t border-base-line">
              {t.values.map((v, i) => (
                <ScrollReveal key={v.title} delayMs={i * 70}>
                  <div className="grid gap-3 border-b border-base-line py-7 sm:grid-cols-[2.5rem_11rem_1fr] sm:items-baseline sm:gap-8">
                    <span className="text-sm font-bold tabular-nums text-brand-orange-ink">
                      0{i + 1}
                    </span>
                    <h3 className="text-xl font-bold text-base-ink sm:text-2xl">{v.title}</h3>
                    <p className="text-base leading-relaxed text-base-slate">{v.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Standards: due-diligence answers up front, as a native keyboard-accessible accordion */}
        <section id="standards" className="scroll-mt-20 bg-base-bg py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>{t.standardsTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                {t.standardsTitleLead}
                {t.standardsTitleLead && s}
                <span className="text-brand-orange-ink">{t.standardsTitleAccent}</span>
                {t.standardsTitleTail}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                {t.standardsBody}
              </p>
            </ScrollReveal>
            <div className="mt-12 border-t border-base-line">
              {t.standards.map((d, i) => (
                <ScrollReveal key={d.title} delayMs={i * 50}>
                  <details open={i === 0} className="group border-b border-base-line">
                    <summary className="flex cursor-pointer list-none items-start gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green-ink [&::-webkit-details-marker]:hidden">
                      <span className="flex-1">
                        <span className="block text-lg font-bold text-base-ink sm:text-xl">
                          {d.title}
                        </span>
                        <span className="mt-1 block text-sm text-base-slate">{d.tag}</span>
                      </span>
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 text-2xl font-light leading-none text-brand-orange-ink transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-7 text-base leading-relaxed text-base-slate">
                      {d.body}
                    </p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* What we do: one panel with hairline cells, reading as a single platform */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal className="max-w-xl">
              <SectionTag>{t.segmentsTag}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                {t.segmentsTitleLead}
                {s}
                <span className="text-brand-orange-ink">{t.segmentsTitleAccent}</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-base-slate">
                {t.segmentsBody}
              </p>
            </ScrollReveal>
            <ScrollReveal
              delayMs={100}
              className="mt-12 overflow-hidden rounded-3xl border border-base-line bg-base-line shadow-sm"
            >
              <div className="grid gap-px sm:grid-cols-2">
                {t.segments.map((seg, i) => (
                  <div
                    key={seg.title}
                    className={`p-7 ${
                      i === 0 ? "bg-brand-orange-deep/[0.07] sm:col-span-2" : "bg-base-panel"
                    }`}
                  >
                    <p
                      className={`font-bold text-base-ink ${
                        i === 0 ? "text-2xl" : "text-lg"
                      }`}
                    >
                      {seg.title}
                    </p>
                    <p
                      className={`mt-2 leading-relaxed text-base-slate ${
                        i === 0 ? "max-w-xl text-base" : "text-sm"
                      }`}
                    >
                      {seg.body}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Group structure: a moving strip, showing breadth rather than stating it */}
        <section className="bg-base-bg py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <h2 className="text-2xl font-bold text-base-ink sm:text-3xl">
                {t.groupTitleLead}
                {s}
                <span className="text-brand-orange-ink">{t.groupTitleAccent}</span>
              </h2>
              <p className="mt-3 max-w-2xl text-base text-base-slate">
                {t.groupBody}
              </p>
            </ScrollReveal>
          </div>
          <div className="relative mt-10 overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base-bg to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base-bg to-transparent sm:w-24" />
            <div className="flex w-max animate-marquee-ltr items-center">
              {groupTrack.map((g, i) => (
                <span
                  key={`${g}-${i}`}
                  className="mx-2.5 shrink-0 whitespace-nowrap rounded-full border border-base-line bg-base-panel px-5 py-2.5 text-sm text-base-ink"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery: asymmetric photo layout, real installs, not a decorative grid */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <ScrollReveal>
              <p className="text-sm font-bold uppercase tracking-wide text-brand-green-ink">
                {t.galleryKicker}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-base-ink sm:text-3xl">
                {t.galleryTitle}
              </h2>
            </ScrollReveal>
            <ScrollReveal
              delayMs={100}
              className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:[grid-auto-rows:150px]"
            >
              <div className="relative col-span-2 row-span-1 overflow-hidden rounded-xl border border-base-line bg-base-panel sm:col-span-2 sm:row-span-2">
                <Image
                  src={gallery[3]}
                  alt={t.galleryImageAlt}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                  sizes="(min-width: 640px) 45vw, 90vw"
                />
              </div>
              {[gallery[4], gallery[5], gallery[6], gallery[7]].map((src, i) => (
                <div
                  key={src}
                  className="relative col-span-1 row-span-1 overflow-hidden rounded-xl border border-base-line bg-base-panel"
                >
                  <Image
                    src={src}
                    alt={fill(t.galleryImageAltN, { n: i + 2 })}
                    fill
                    className="object-cover transition duration-500 hover:scale-105"
                    sizes="(min-width: 640px) 22vw, 45vw"
                  />
                </div>
              ))}
            </ScrollReveal>
          </div>
        </section>

        {/* CTA: textured callback to the hero photo */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <ScrollReveal className="relative overflow-hidden rounded-3xl bg-brand-orange-tint px-6 py-14 text-center sm:px-12">
            <Image
              src={OLD_SITE_IMAGES.heroHouse}
              alt=""
              fill
              aria-hidden
              className="object-cover opacity-10"
              sizes="100vw"
            />
            <div className="relative">
              <h2 className="text-2xl font-bold text-base-ink sm:text-3xl">
                {t.ctaTitleLead}
                {s}
                <span className="text-brand-orange-ink">{t.ctaTitleAccent}</span>
                {t.ctaTitleTail}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-base-slate sm:text-base">
                {t.ctaBody}
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={home("#assessment")}
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
                >
                  {t.cta}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
      <Footer locale={lang} t={dict.footer} nav={dict.header.nav} />
    </div>
  );
}
