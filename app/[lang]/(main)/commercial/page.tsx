import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/commercial">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = getDictionary(lang).meta;
  return {
    title: t.commercialPageTitle,
    description: t.commercialPageDescription,
    alternates: {
      canonical: localePath(lang, "/commercial"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/commercial")])),
    },
  };
}

export default async function CommercialPage({ params }: PageProps<"/[lang]/commercial">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const t = dict.commercialPage;
  const home = (hash: string) => localePath(lang, `/${hash}`);

  return (
    <>
      <Header locale={lang} t={dict} />
      <main className="flex flex-1 items-center justify-center bg-base-bg px-4 py-24">
        <div className="mx-auto max-w-lg text-center">
          <span className="section-eyebrow inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1 text-xs font-semibold uppercase text-brand-green-ink">
            {t.eyebrow}
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-base-slate">{t.body}</p>
          <div className="mt-8">
            <Link
              href={home("#assessment")}
              className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
            >
              {t.cta}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={lang} t={dict.footer} />
    </>
  );
}
