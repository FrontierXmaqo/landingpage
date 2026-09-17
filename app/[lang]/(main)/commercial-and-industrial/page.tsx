import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionTag from "../components/SectionTag";
import ScrollReveal from "../components/ScrollReveal";
import CiLeadForm from "./CiLeadForm";
import ClientMarquee from "./ClientMarquee";
import CountUpStat from "./CountUpStat";
import ProjectsCarousel, { type Surface } from "./ProjectsCarousel";
import { CheckCircle, PILLAR_ICONS } from "./icons";
import {
  CI_META,
  CLIENTS,
  CREDENTIAL_LINE,
  CREDENTIALS,
  FINAL_CTA,
  HERO,
  PILLARS,
  PROJECTS,
  PROJECT_VIDEO_URL,
  TRUST_STATS,
} from "./content";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";
import { getPublishedCiContent } from "@/lib/publishedContent";

const PATH = "/commercial-and-industrial";

/** Background the project carousel sits on. Marketing is comparing the three. */
const PROJECTS_SURFACE: Surface = "navy";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/commercial-and-industrial">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: CI_META.title,
    description: CI_META.description,
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

  // Projects, client roster and trust stats are CMS-managed; the constants in
  // content.ts are the fallback if Supabase is unreachable or a table is empty.
  const ci = await getPublishedCiContent({
    projects: PROJECTS,
    clients: CLIENTS,
    trustStats: TRUST_STATS,
  });

  return (
    <div data-theme="ci" className="contents">
      <Header locale={lang} t={dict} />

      <main className="flex-1 overflow-x-clip">
        {/* ---------- 1. Hero + enquiry form ---------- */}
        <section id="assessment" className="relative overflow-hidden bg-base-bg">
          {/* Grid-line + colour-blob glow, matching the density already used
              on EV/ATAP's heroes. */}
          <div aria-hidden className="atap-hero-glow atap-hero-dots pointer-events-none absolute inset-0" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div>
              <span className="section-eyebrow inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1 text-xs font-semibold uppercase text-brand-green-ink">
                {HERO.eyebrow}
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-base-ink sm:text-5xl">
                {HERO.title}
              </h1>
              <p className="mt-4 max-w-xl text-base text-base-slate sm:text-lg">{HERO.body}</p>

              <ul className="mt-7 grid gap-3">
                {HERO.valueProps.map((prop) => (
                  <li key={prop} className="flex items-center gap-2.5 text-sm font-medium text-base-ink">
                    <CheckCircle className="shrink-0 text-brand-green-ink" />
                    {prop}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#assessment"
                  className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
                >
                  {HERO.primaryCta}
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center rounded-full border border-base-line px-6 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate"
                >
                  {HERO.secondaryCta}
                </a>
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-3 border-t border-base-line pt-6 sm:grid-cols-4">
                {CREDENTIALS.map((c) => (
                  <li
                    key={c.mark}
                    className="flex flex-col items-start gap-1 rounded-xl border border-base-line bg-base-panel px-3 py-3"
                  >
                    {c.logo ? (
                      <Image src={c.logo} alt={c.mark} width={96} height={32} className="h-8 w-auto object-contain" />
                    ) : (
                      <span className="text-base font-bold leading-tight text-brand-green-ink">{c.mark}</span>
                    )}
                    <span className="text-xs leading-snug text-base-slate">{c.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pl-4">
              <CiLeadForm />
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
              Trusted by Leading Commercial &amp; Industrial Brands Across Malaysia
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
        <ProjectsCarousel projects={ci.projects} surface={PROJECTS_SURFACE} videoUrl={PROJECT_VIDEO_URL} />

        {/* ---------- 4. Why MAQO for C&I ---------- */}
        <section id="why" className="bg-base-panel py-16 sm:py-20" aria-labelledby="why-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTag>Why MAQO</SectionTag>
            <h2
              id="why-heading"
              className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-base-ink sm:text-4xl"
            >
              Built for commercial and industrial scale
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {PILLARS.map((pillar, i) => {
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

        {/* ---------- 5. Closing CTA ---------- */}
        <section className="bg-brand-navy py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl">{FINAL_CTA.title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/85 sm:text-base">{FINAL_CTA.body}</p>
            <div className="mt-8 flex justify-center">
              <a
                href="#assessment"
                className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3.5 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
              >
                {FINAL_CTA.cta}
              </a>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
              {CREDENTIAL_LINE.join(" · ")}
            </p>
          </div>
        </section>
      </main>

      <Footer
        locale={lang}
        t={dict.footer}
        nav={dict.header.nav}
        explore={[
          { label: "Client Roster", href: "#clients" },
          { label: "Our Projects", href: "#projects" },
          { label: "Why MAQO", href: "#why" },
          { label: "Get an Assessment", href: "#assessment" },
        ]}
      />
    </div>
  );
}
