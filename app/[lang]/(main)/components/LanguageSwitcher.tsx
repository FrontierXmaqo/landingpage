"use client";

import { usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_LABELS,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n/config";

function rememberAndGo(locale: Locale, path: string) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  // Carry the query string across, so campaign_id / utm / gclid still reach the lead
  // form after a visitor from an ad switches language.
  window.location.assign(path + window.location.search + window.location.hash);
}

/**
 * EN / 中文 / BM. Wide screens get three links; phones get a native select, since the
 * header has no room for three buttons beside the logo and the CTA.
 *
 * Unstyled apart from the classes passed in, so the main site (Tailwind) and the EV
 * page (its own stylesheet) can each dress it in their own look.
 */
export default function LanguageSwitcher({
  locale,
  label,
  classes,
}: {
  locale: Locale;
  label: string;
  classes: { root: string; links: string; link: string; select: string };
}) {
  const pathname = usePathname() || `/${locale}`;

  return (
    <div className={classes.root}>
      <nav aria-label={label} className={classes.links}>
        {LOCALES.map((l) => {
          const href = switchLocalePath(pathname, l);
          const active = l === locale;
          return (
            <a
              key={l}
              href={href}
              hrefLang={l}
              lang={l === "cn" ? "zh-Hans" : l}
              aria-current={active ? "true" : undefined}
              title={LOCALE_LABELS[l].full}
              className={classes.link}
              onClick={(e) => {
                e.preventDefault();
                if (!active) rememberAndGo(l, href);
              }}
            >
              {LOCALE_LABELS[l].short}
            </a>
          );
        })}
      </nav>

      <select
        aria-label={label}
        value={locale}
        onChange={(e) => {
          const next = e.target.value as Locale;
          rememberAndGo(next, switchLocalePath(pathname, next));
        }}
        className={classes.select}
      >
        {LOCALES.map((l) => (
          <option key={l} value={l}>
            {LOCALE_LABELS[l].short}
          </option>
        ))}
      </select>
    </div>
  );
}
