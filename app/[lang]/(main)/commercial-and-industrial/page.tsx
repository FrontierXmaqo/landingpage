import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectionTag from "../components/SectionTag";
import SectionHeading from "../components/SectionHeading";
import ScrollReveal from "../components/ScrollReveal";
import CiLeadForm from "./CiLeadForm";
import { CheckCircle, PILLAR_ICONS, PROJECT_ICONS } from "./icons";
import {
  CI_META,
  CLIENTS,
  CREDENTIAL_LINE,
  FINAL_CTA,
  HERO,
  PILLARS,
  PROJECTS,
  PROJECT_VIDEO_URL,
  TRUST_STATS,
} from "./content";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";

const PATH = "/commercial-and-industrial";

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

  return (
    <>
      <Header locale={lang} t={dict} />

      <main className="flex-1">
        {/* ---------- 1. Hero + enquiry form ---------- */}
        <section className="relative overflow-hidden bg-base-bg">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
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

              <p className="mt-8 border-t border-base-line pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-base-slate">
                {CREDENTIAL_LINE.join(" · ")}
              </p>
            </div>

            <div className="lg:pl-4">
              <CiLeadForm />
            </div>
          </div>
        </section>

        {/* ---------- 2. Client roster + trust stats ---------- */}
        <section className="border-y border-base-line bg-base-panel py-16" aria-labelledby="clients-heading">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              id="clients-heading"
              className="text-center text-sm font-semibold uppercase tracking-[0.14em] text-base-slate"
            >
              Trusted by Leading Commercial &amp; Industrial Brands Across Malaysia
            </h2>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CLIENTS.map((name) => (
                <li
                  key={name}
                  className="flex h-20 items-center justify-center rounded-xl border border-base-line bg-base-bg px-4 text-center text-base font-semibold text-base-slate"
                >
                  {name}
                </li>
              ))}
            </ul>

            <dl className="mt-10 grid grid-cols-1 gap-8 border-t border-base-line pt-10 text-center sm:grid-cols-3">
              {TRUST_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-4xl font-bold text-brand-green-ink">{stat.value}</span>
                    <span className="mt-2 block text-sm text-base-slate">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- 3. Latest projects ---------- */}
        <section id="projects" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeading
            eyebrow="Our work"
            title="Our Latest Commercial Projects"
            body="Rooftop systems delivered end to end by our own engineering and installation teams, on live industrial and commercial sites."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PROJECTS.map((project, i) => {
              const Icon = PROJECT_ICONS[project.tag as keyof typeof PROJECT_ICONS];
              return (
                <ScrollReveal key={project.client} delayMs={i * 90}>
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-line bg-base-panel shadow-md">
                    {/* Placeholder artwork. Swap for a real site photo: drop the
                        file in /public and render it with next/image here. */}
                    <div className="relative flex h-44 flex-col items-center justify-center gap-2 bg-brand-green-tint text-brand-green-deep">
                      {Icon && <Icon className="h-8 w-8" />}
                      <span className="text-3xl font-bold">{project.capacity}</span>
                      <span className="absolute left-4 top-4 rounded-full bg-base-panel/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-base-slate">
                        {project.tag}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold leading-snug text-base-ink">{project.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-base-slate">
                        {project.client} · {project.location}
                      </p>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-base-slate">{project.detail}</p>
                      <p className="mt-5 flex items-start gap-2 border-t border-base-line pt-4 text-sm font-semibold text-brand-green-ink">
                        <CheckCircle className="mt-0.5 shrink-0" />
                        {project.outcome}
                      </p>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>

          <p className="mt-8">
            <a
              href={PROJECT_VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-green-ink underline underline-offset-4 hover:text-brand-green-deep"
            >
              Watch our commercial &amp; industrial project showcase
            </a>
          </p>
        </section>

        {/* ---------- 4. Why MAQO for C&I ---------- */}
        <section className="bg-base-panel py-16 sm:py-20" aria-labelledby="why-heading">
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

      <Footer locale={lang} t={dict.footer} />
    </>
  );
}
