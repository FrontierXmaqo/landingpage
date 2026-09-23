import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CONTACT } from "@/lib/content";
import { PRIVACY_LAST_UPDATED, PRIVACY_POLICY } from "@/lib/privacyPolicy";
import { HTML_LANG, LOCALES, getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const p = PRIVACY_POLICY[lang];
  return {
    title: `${p.title} | MAQO Solar`,
    description: p.metaDescription,
    alternates: {
      canonical: localePath(lang, "/privacy"),
      languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], localePath(l, "/privacy")])),
    },
  };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const p = PRIVACY_POLICY[lang];

  return (
    <div className="contents">
      <Header locale={lang} t={dict} ctaHref={localePath(lang, "/#assessment")} />
      <main className="flex-1 bg-base-bg px-4 py-16 sm:px-6 sm:py-20">
        <article className="mx-auto max-w-3xl text-base leading-relaxed text-base-slate">
          <h1 className="text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{p.title}</h1>
          <p className="mt-3 text-sm">
            {p.updatedLabel} <time dateTime={PRIVACY_LAST_UPDATED}>{PRIVACY_LAST_UPDATED}</time>
          </p>
          <p className="mt-8">{p.intro}</p>

          {p.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-xl font-semibold text-base-ink">{s.heading}</h2>
              {s.paragraphs?.map((para) => (
                <p key={para} className="mt-3">{para}</p>
              ))}
              {s.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-base-ink">{p.contactHeading}</h2>
            <p className="mt-3">{p.contactIntro}</p>
            <ul className="mt-3 space-y-1">
              <li>MAQO Engineering Sdn Bhd</li>
              <li>
                {p.emailLabel}{" "}
                <a href={CONTACT.emailHref} className="font-semibold text-brand-green-deep hover:underline">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                {p.phoneLabel}{" "}
                <a href={CONTACT.officeHref} className="font-semibold text-brand-green-deep hover:underline">
                  {CONTACT.office}
                </a>
              </li>
              <li>
                {p.addressLabel} {CONTACT.address}
              </li>
            </ul>
          </section>

          <p className="mt-10 border-t border-base-line pt-6 text-sm">{p.languageNote}</p>
        </article>
      </main>
      <Footer locale={lang} t={dict.footer} nav={dict.header.nav} />
    </div>
  );
}
