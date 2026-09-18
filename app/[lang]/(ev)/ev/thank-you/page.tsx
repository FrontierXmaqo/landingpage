import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LanguageSwitcher from "@/app/[lang]/(main)/components/LanguageSwitcher";
import ThankYouTracking from "@/app/[lang]/(main)/components/ThankYouTracking";
import { OLD_SITE_IMAGES } from "@/lib/content";
import { getDictionary, hasLocale, localePath } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/ev/thank-you">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: "Thank You | MAQO EV",
    robots: { index: false, follow: false },
  };
}

export default async function EvThankYouPage({ params }: PageProps<"/[lang]/ev/thank-you">) {
  const { lang: locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const t = dict.ev;
  const evHome = localePath(locale, "/ev");

  const nav = [
    { href: localePath(locale, "/"), label: t.nav.residential },
    { href: localePath(locale, "/commercial-and-industrial"), label: t.nav.commercial },
    { href: evHome, label: t.nav.ev },
    { href: localePath(locale, "/atap"), label: t.nav.atap },
    { href: localePath(locale, "/bess"), label: t.nav.bess },
    { href: localePath(locale, "/about"), label: t.nav.about },
  ];

  return (
    <>
      <ThankYouTracking id="ev" />
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link href={localePath(locale, "/")} className="topbar-logo" aria-label={dict.header.logoAlt}>
            <Image src={OLD_SITE_IMAGES.logo} alt={dict.header.logoAlt} fill className="topbar-logo-img" sizes="160px" priority />
          </Link>
          <div className="topbar-right">
            <LanguageSwitcher
              locale={locale}
              label={dict.languageSwitcher.label}
              classes={{ root: "lang-switch", links: "lang-pills", link: "lang-pill", select: "lang-select" }}
            />
            <a className="btn btn-primary btn-sm" href={`${evHome}#assessment`}>
              {dict.header.cta}
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section style={{ background: "var(--sand)", paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span className="eyebrow">
              <i />
              {t.thankYou.eyebrow}
            </span>

            <div
              style={{
                marginTop: "24px",
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                background: "var(--orange)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 16px 32px -12px rgba(30,158,82,0.55)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            <h1 style={{ marginTop: "24px", maxWidth: "560px" }}>{t.thankYou.title}</h1>
            <p className="lede" style={{ maxWidth: "460px" }}>
              {t.thankYou.body}
            </p>

            <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "24px" }}>
              <Link href={localePath(locale, "/about")} className="btn btn-primary btn-lg">
                {t.thankYou.learnMore}
                <svg className="arrow" viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 10h12M11 5l5 5-5 5" />
                </svg>
              </Link>
              <Link href={localePath(locale, "/")} className="link-arrow">
                {t.thankYou.backHome}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <p className="foot-wordmark">MAQO Engineering Sdn Bhd</p>
              <p>{t.footer.tagline}</p>
              <p className="foot-cred-line">Suruhanjaya Tenaga · SEDA · CIDB G7</p>
              <ul className="foot-certs">
                {t.hero.trust.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="foot-col">
              <h5>{t.footer.company}</h5>
              {nav.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
            <div className="foot-col">
              <h5>{t.footer.explore}</h5>
              <a href={`${evHome}#the-problem`}>{t.nav.problem}</a>
              <a href={`${evHome}#calculator`}>{t.footer.calculator}</a>
              <a href={`${evHome}#how-it-works`}>{t.nav.howItWorks}</a>
              <a href={`${evHome}#covered`}>{t.nav.covered}</a>
              <a href={`${evHome}#faq`}>{t.nav.faq}</a>
            </div>
            <div className="foot-col">
              <h5>{t.footer.contact}</h5>
              <a href="mailto:admin@maqo.asia">admin@maqo.asia</a>
              <a href="tel:60380691706">603-8069 1706</a>
              <p>27, Jalan TPP 1/1, Taman Perindustrian Puchong, 47100 Puchong, Selangor</p>
            </div>
          </div>
          <div className="foot-bottom">
            <span>{t.footer.rights}</span>
          </div>
        </div>
      </footer>
    </>
  );
}
