import { CONTACT, CREDENTIALS } from "@/lib/content";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";

export default function Footer({
  locale,
  t,
  nav,
  explore,
}: {
  locale: Locale;
  t: Dictionary["footer"];
  /** The site's cross-page nav, moved here now that the header no longer
   * shows it. Same labels/order Header used to render. */
  nav: Dictionary["header"]["nav"];
  /** Quick links to this same page's own sections — the pattern EV's footer
   * already used. Plain in-page anchors, not routed through localePath. */
  explore?: { label: string; href: string }[];
}) {
  const links = [
    { label: nav.residential, href: localePath(locale, "/") },
    { label: nav.commercial, href: localePath(locale, "/commercial-and-industrial") },
    { label: nav.ev, href: localePath(locale, "/ev") },
    { label: nav.atap, href: localePath(locale, "/atap") },
    { label: nav.about, href: localePath(locale, "/about") },
    { label: t.contactUs, href: localePath(locale, "/#assessment") },
  ];

  return (
    <footer className="mt-auto border-t border-base-line bg-base-panel py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-semibold text-base-ink">MAQO Engineering Sdn Bhd</p>
            <p className="mt-2 text-sm text-base-slate">{t.tagline}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-base-slate">
              {CREDENTIALS.join(" · ")}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-base-ink">{t.company}</p>
            <ul className="mt-3 space-y-2 text-sm text-base-slate">
              {links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-base-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {explore && explore.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-base-ink">Explore</p>
              <ul className="mt-3 space-y-2 text-sm text-base-slate">
                {explore.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="hover:text-base-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-base-ink">{t.contact}</p>
            <ul className="mt-3 space-y-2 text-sm text-base-slate">
              <li>
                {t.email}{" "}
                <a href={CONTACT.emailHref} className="hover:text-base-ink">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                {t.office}{" "}
                <a href={CONTACT.officeHref} className="hover:text-base-ink">
                  {CONTACT.office}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-base-ink"
                >
                  {CONTACT.address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-base-line pt-6 text-xs text-base-slate sm:flex-row sm:items-center sm:justify-between">
          <span>{t.rights}</span>
          <span>Suruhanjaya Tenaga · SEDA · CIDB G7</span>
        </div>
      </div>
    </footer>
  );
}
