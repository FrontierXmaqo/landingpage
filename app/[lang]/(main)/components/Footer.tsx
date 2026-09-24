import { CONTACT, CREDENTIALS } from "@/lib/content";
import SocialLinks from "./SocialLinks";
import { PRIVACY_POLICY } from "@/lib/privacyPolicy";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import s from "./Footer.module.css";

/** The one footer every page renders, /ev included, so the links and layout
 *  never drift between pages. */
export default function Footer({
  locale,
  t,
  nav,
}: {
  locale: Locale;
  t: Dictionary["footer"];
  nav: Dictionary["header"]["nav"];
}) {
  const links = [
    { label: nav.residential, href: localePath(locale, "/residential") },
    { label: t.commercial, href: localePath(locale, "/commercial-and-industrial") },
    { label: nav.bess, href: localePath(locale, "/bess") },
    { label: nav.ev, href: localePath(locale, "/ev") },
    { label: nav.atap, href: localePath(locale, "/atap") },
    { label: nav.products, href: localePath(locale, "/products-and-services") },
    { label: nav.about, href: localePath(locale, "/about") },
    { label: t.contactUs, href: localePath(locale, "/contact") },
  ];

  return (
    <footer className={s.footer}>
      <div className={s.wrap}>
        <div className={s.grid}>
          <div>
            <p className={s.heading}>MAQO Engineering Sdn Bhd</p>
            <p className={s.tagline}>{t.tagline}</p>
            <p className={s.creds}>{CREDENTIALS.join(" · ")}</p>
            <div className={s.social}>
              <SocialLinks />
            </div>
          </div>

          <div>
            <p className={s.heading}>{t.solutions}</p>
            <ul className={s.list}>
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={s.heading}>{t.contact}</p>
            <ul className={s.list}>
              <li>
                {t.email} <a href={CONTACT.emailHref}>{CONTACT.email}</a>
              </li>
              <li>
                {t.office} <a href={CONTACT.officeHref}>{CONTACT.office}</a>
              </li>
              <li>
                <a href={CONTACT.mapsHref} target="_blank" rel="noopener noreferrer">
                  {CONTACT.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={s.bottom}>
          <span>{t.rights}</span>
          <a href={localePath(locale, "/privacy")}>{PRIVACY_POLICY[locale].footerLink}</a>
        </div>
      </div>
    </footer>
  );
}
