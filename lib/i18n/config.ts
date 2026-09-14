// URL segment -> language. "cn" is the segment the business asked for; the HTML lang
// attribute still uses the proper BCP 47 tag so browsers and Google read it correctly.
export const LOCALES = ["en", "cn", "ms"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

// Remembers the visitor's last pick, so a bare "/" link sends them back to it.
export const LOCALE_COOKIE = "maqo_lang";

export const HTML_LANG: Record<Locale, string> = {
  en: "en-MY",
  cn: "zh-Hans-MY",
  ms: "ms-MY",
};

// Short labels for the header switcher, each written in its own language.
export const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  en: { short: "EN", full: "English" },
  cn: { short: "中文", full: "中文（简体）" },
  ms: { short: "BM", full: "Bahasa Melayu" },
};

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefixes an in-site path with the locale: localePath("cn", "/about#standards") -> "/cn/about#standards". */
export function localePath(locale: Locale, path = "/") {
  if (path === "/" || path === "") return `/${locale}`;
  if (path.startsWith("/#")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** Swaps the locale segment of a pathname that already has one. */
export function switchLocalePath(pathname: string, locale: Locale) {
  const parts = pathname.split("/");
  if (parts.length > 1 && hasLocale(parts[1])) {
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  }
  return localePath(locale, pathname);
}
