import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import SectionTag from "../components/SectionTag";
import ProductCatalog from "./ProductCatalog";
import { PAGE_COPY } from "./copy";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/products-and-services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = PAGE_COPY[lang];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: localePath(lang, "/products-and-services"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/products-and-services")])),
    },
  };
}

// One line icon per service, in the same order as PAGE_COPY services: panel,
// banknote, bar chart, wrench, meter arrow, house.
const SERVICE_ICONS = [
  "M3 5h18l-2 10H5L3 5Zm4 0-1 10m6-10v10m5-10 1 10M4 10h16M12 15v4m-4 0h8",
  "M3 7h18v10H3V7Zm9 2.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM6 10v4m12-4v4",
  "M4 20h16M7 16v-4m5 4V8m5 8v-6",
  "M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z",
  "M4 18 9 13l3 3 7-7m0 0h-4m4 0v4",
  "M3 11 12 4l9 7M5 10v10h14V10M9 20v-6h6v6",
];

export default async function ProductsPage({ params }: PageProps<"/[lang]/products-and-services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = PAGE_COPY[lang];
  // No lead form on this page; quotes go to the homepage consultation form.
  const quoteHref = localePath(lang, "/#consultation");

  return (
    <>
      <Header locale={lang} t={dict} ctaHref={quoteHref} />
      <main className="flex-1 overflow-x-clip">
        <section id="products" className="scroll-mt-20 pb-20 pt-14 sm:pb-24 sm:pt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.eyebrow}</SectionTag>
              <h1 className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.1] tracking-tight text-base-ink sm:text-5xl">
                {t.titleLead}
                {dict.space}
                <span className="text-brand-orange-ink">{t.titleAccent}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-base-slate sm:text-lg">
                {t.intro}
              </p>
            </ScrollReveal>

            <div className="mt-10">
              <ProductCatalog locale={lang} ctaHref={quoteHref} />
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-20 border-t border-base-line bg-base-panel py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <ScrollReveal>
              <SectionTag>{t.servicesEyebrow}</SectionTag>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
                {t.servicesLead}
                {dict.space}
                <span className="text-brand-green-ink">{t.servicesAccent}</span>
              </h2>
            </ScrollReveal>

            <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {t.services.map((svc, i) => (
                <li key={svc.title}>
                  <ScrollReveal delayMs={i * 60} className="flex h-full gap-4 border-t-2 border-brand-green pt-5">
                    <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-green-tint text-brand-green-ink">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d={SERVICE_ICONS[i]} />
                      </svg>
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-base-ink">{svc.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-base-slate">{svc.body}</p>
                    </div>
                  </ScrollReveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-brand-forest py-16 text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{t.ctaTitle}</h2>
              <p className="mt-2 max-w-xl text-white/80">{t.ctaBody}</p>
            </div>
            <Link
              href={quoteHref}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-brand-orange-deep px-7 text-sm font-semibold text-white transition hover:brightness-95"
            >
              {t.ctaButton}
            </Link>
          </div>
        </section>
      </main>
      <Footer
        locale={lang}
        t={dict.footer}
        nav={dict.header.nav}
      />
    </>
  );
}
