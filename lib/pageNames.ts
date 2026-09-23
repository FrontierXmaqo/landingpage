import { DEFAULT_LOCALE, LOCALES, hasLocale, localePath, type Locale } from "@/lib/i18n";

/**
 * Path segment -> the label shown on the Performance Analytics dashboard.
 *
 * Declaration order is the dashboard's display order, so the breakdown reads
 * the way the site is actually structured — the residential landing page
 * first, then the product pages, then the supporting pages. Keeping order and
 * labels in one place means a card can't appear in a position that contradicts
 * the site's own hierarchy.
 */
const PAGE_LABELS: Record<string, string> = {
  "": "Home",
  residential: "Resi",
  atap: "ATAP",
  bess: "BESS",
  "commercial-and-industrial": "Commercial & Industrial",
  ev: "EV",
  about: "About",
};

/**
 * Every page the dashboard reports on, in site order, so a page with no
 * visits yet still gets a card ("Not enough visits yet") in its usual spot
 * instead of vanishing from the breakdown.
 */
export const ALL_PAGE_NAMES: string[] = Object.values(PAGE_LABELS);

/** Pages that embed a lead form under #assessment — the ones form drop-off applies to. */
export const PAGES_WITH_FORM = new Set(["Home", "Resi", "ATAP", "BESS", "Commercial & Industrial", "EV"]);

/** "/en/atap" and "/ms/atap" both resolve to "ATAP", so language is reported separately from page. */
export function pageNameFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const withoutLocale = (LOCALES as readonly string[]).includes(segments[0]) ? segments.slice(1) : segments;
  const key = withoutLocale[0] ?? "";
  return PAGE_LABELS[key] ?? key;
}

const ROUTE_FOR_PAGE_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(PAGE_LABELS).map(([route, label]) => [label, route])
);

/**
 * The reverse of pageNameFromPath: "BESS" -> every locale's path for it
 * ("/en/bess", "/cn/bess", "/ms/bess"). Lets a filter target one page
 * category across every language at once instead of one raw path at a time.
 */
export function pathsForPageName(page: string): string[] {
  const route = ROUTE_FOR_PAGE_NAME[page];
  if (route === undefined) return [];
  return LOCALES.map((locale) => localePath(locale, route ? `/${route}` : "/"));
}

/**
 * Which language version of a page a path belongs to. Every public URL is
 * prefixed (proxy.ts redirects unprefixed ones), so a path without a prefix
 * is either a pre-launch row or a direct hit that skipped the redirect —
 * counted under the default locale rather than dropped.
 */
export function localeFromPath(path: string): Locale {
  const first = path.split("/").filter(Boolean)[0] ?? "";
  return hasLocale(first) ? first : DEFAULT_LOCALE;
}
