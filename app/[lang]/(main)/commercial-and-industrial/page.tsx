import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionTag from "../components/SectionTag";
import ScrollReveal from "../components/ScrollReveal";
import CredentialBadges from "../components/CredentialBadges";
import CiLeadForm from "./CiLeadForm";
import ClientMarquee from "./ClientMarquee";
import CountUpStat from "./CountUpStat";
import ProjectsCarousel, { type Surface } from "./ProjectsCarousel";
import { BESS_ICONS, CheckCircle, IconChevron, PILLAR_ICONS } from "./icons";
import { CLIENTS, PROJECTS, PROJECT_VIDEO_URL, TRUST_STATS } from "./content";
import { getCiCopy } from "./copy";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";
import { getPublishedCiContent, getPublishedFaq, getPublishedLeadFormOptions, getPublishedLeadFormFields } from "@/lib/publishedContent";

const PATH = "/commercial-and-industrial";

/** Background the project carousel sits on. Marketing is comparing the three. */
const PROJECTS_SURFACE: Surface = "navy";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/commercial-and-industrial">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getCiCopy(lang);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: localePath(lang, PATH),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, PATH)])),
    },
  };
}

export default async function CommercialAndIndustrialPage({
  params,
}: PageProps<"/[lang]/commercial-and-industrial">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const c = getCiCopy(lang);

  // Projects, client roster and trust stats are CMS-managed; the constants in
  // content.ts are the fallback if Supabase is unreachable or a table is empty.
  const [ci, faqItems, leadFormOptions, customFields] = await Promise.all([
    getPublishedCiContent({
      projects: PROJECTS,
      clients: CLIENTS,
      trustStats: TRUST_STATS,
    }),
    // No hardcoded fallback: this page has never had an FAQ section, so an
    // empty CMS table just means the section doesn't render yet.
    getPublishedFaq("ci", []),
    getPublishedLeadFormOptions("ci"),
    getPublishedLeadFormFields("ci"),
  ]);

  return (
    <div data-theme="ci" className="contents">
      <Header locale={lang} t={dict} />

      <main className="flex-1 overflow-x-clip">
        {/* ---------- 1. Hero + enquiry form ---------- */}
        <section id="assessment" className="relative overflow-hidden bg-base-bg">
          {/* Backdrop: a rooftop solar photo, darkened by a scrim so the copy
              still clears AA, with the wash/rules/blob layers on top for the
              same C&I tint the page had before the photo. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src="/ci-hero-solar-rooftop.png"
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="hero-scrim absolute inset-0" />
            <div className="ci-hero-wash absolute inset-0" />
            <div className="ci-hero-rules absolute inset-0" />
            <div className="ci-hero-blob absolute -right-24 -top-44 h-[460px] w-[460px]" />
            <div className="ci-hero-blob-deep absolute -bottom-52 -left-32 h-[400px] w-[400px]" />
          </div>
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-16 lg:pt-12">
            <div>
              <span className="section-eyebrow inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1 text-xs font-semibold uppercase text-brand-green-ink">
                {c.hero.eyebrow}
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
                {c.hero.title}
                <span className="ci-hero-hl">{c.hero.titleAccent}</span>
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">{c.hero.body}</p>

              <ul className="mt-7 grid gap-3">
                {c.hero.valueProps.map((prop) => (
                  <li key={prop} className="flex items-center gap-2.5 text-sm font-medium text-white">
                    <CheckCircle className="shrink-0 text-brand-green-tint" />
                    {prop}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#assessment"
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
                >
                  {c.hero.primaryCta}
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
                >
                  {c.hero.secondaryCta}
                </a>
              </div>

              <div className="mt-8 border-t border-white/25 pt-6">
                <CredentialBadges t={dict.credentialBadges} set="commercial" inline />
              </div>
            </div>

            <div className="lg:pl-4">
              <CiLeadForm locale={lang} t={c.form} options={leadFormOptions} customFields={customFields} />
            </div>
          </div>
        </section>

        {/* ---------- 2. Client roster + trust stats ---------- */}
        <section id="clients" className="border-y border-base-line bg-base-panel py-16" aria-labelledby="clients-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              id="clients-heading"
              className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-base-slate"
            >
              {c.clients.heading}
            </h2>
          </div>

          {/* Full-bleed: the roster runs edge to edge, outside the page gutter. */}
          <ClientMarquee clients={ci.clients} />

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <dl className="mt-10 grid grid-cols-1 gap-8 border-t border-base-line pt-10 text-center sm:grid-cols-3">
              {ci.trustStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <CountUpStat
                      value={stat.value}
                      className="block text-4xl font-bold text-brand-green-ink"
                    />
                    <span className="mt-2 block text-sm text-base-slate">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- 3. Latest projects ---------- */}
        <ProjectsCarousel
          projects={ci.projects}
          surface={PROJECTS_SURFACE}
          videoUrl={PROJECT_VIDEO_URL}
          t={c.projects}
        />

        {/* ---------- 4. Battery storage ---------- */}
        {/* Sits between the navy carousel and the panel-grey pillar grid, so it
            takes the paper background and states its points as a ruled list
            rather than a second deck of shadowed cards. */}
        <section id="bess" className="bg-base-bg py-16 sm:py-20" aria-labelledby="bess-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <SectionTag>{c.bess.eyebrow}</SectionTag>
                <h2
                  id="bess-heading"
                  className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl"
                >
                  {c.bess.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-base-slate sm:text-base">{c.bess.body}</p>
                <Link
                  href={localePath(lang, "/bess")}
                  className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green-ink transition hover:text-brand-green-deep"
                >
                  {c.bess.cta}
                  <IconChevron className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-base-line sm:grid-cols-2">
                {c.bess.points.map((point, i) => {
                  const Icon = BESS_ICONS[point.icon];
                  return (
                    <li key={point.title} className="bg-base-panel">
                      <ScrollReveal delayMs={i * 80}>
                        <div className="h-full p-6 sm:p-7">
                          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green-tint text-brand-green-deep">
                            <Icon />
                          </span>
                          <h3 className="mt-4 text-base font-bold text-base-ink">{point.title}</h3>
                          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-base-slate">
                            {point.bullets.map((bullet) => (
                              <li key={bullet} className="flex gap-2">
                                <span className="mt-2 h-1 w-1 flex-none rounded-full bg-brand-green-deep" aria-hidden="true" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </ScrollReveal>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-8 border-t border-base-line pt-6 text-xs leading-relaxed text-base-slate sm:text-sm">
              {c.bess.foot}
            </p>
          </div>
        </section>

        {/* ---------- 5. Why MAQO for C&I ---------- */}
        <section id="why" className="bg-base-panel py-16 sm:py-20" aria-labelledby="why-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTag>{c.why.eyebrow}</SectionTag>
            <h2
              id="why-heading"
              className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-base-ink sm:text-4xl"
            >
              {c.why.title}
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {c.pillars.map((pillar, i) => {
                const Icon = PILLAR_ICONS[pillar.icon];
                return (
                  <ScrollReveal key={pillar.title} delayMs={i * 80}>
                    <div className="h-full rounded-2xl border border-base-line bg-base-bg p-7 shadow-md">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-tint text-brand-green-deep">
                        <Icon />
                      </span>
                      <h3 className="mt-5 text-lg font-bold text-base-ink">{pillar.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-base-slate">{pillar.body}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------- 6. FAQ ---------- */}
        {/* Only renders once at least one question is published, this page
            has never had an FAQ before, so an empty draft just means it
            stays off the live page. */}
        {faqItems.length > 0 && (
          <section id="faq" className="scroll-mt-20 bg-base-bg py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
              <SectionTag>{c.faq.eyebrow}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                {c.faq.title}
              </h2>
              <div className="mt-10 divide-y divide-base-line rounded-2xl border border-base-line bg-base-panel">
                {faqItems.map((item, i) => (
                  <details key={item.q} name="ci-faq" open={i === 0} className="group">
                    <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-base-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span aria-hidden className="shrink-0 text-lg text-base-slate">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-base-slate sm:px-6">{item.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------- 7. Closing CTA ---------- */}
        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl">{c.finalCta.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">{c.finalCta.body}</p>
            <div className="mt-8 flex justify-center">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3.5 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
              >
                {c.finalCta.cta}
              </a>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {c.credentialLine.join(" · ")}
            </p>
          </div>
        </section>
      </main>

      <Footer
        locale={lang}
        t={dict.footer}
        nav={dict.header.nav}
        explore={[
          { label: c.explore.clients, href: "#clients" },
          { label: c.explore.projects, href: "#projects" },
          { label: c.explore.bess, href: "#bess" },
          { label: c.explore.why, href: "#why" },
          ...(faqItems.length > 0 ? [{ label: c.explore.faq, href: "#faq" }] : []),
          { label: c.explore.assessment, href: "#assessment" },
        ]}
      />
    </div>
  );
}
