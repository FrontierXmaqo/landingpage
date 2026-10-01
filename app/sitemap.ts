import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, localePath } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/site";

/**
 * Every public, indexable page, without its locale prefix. Thank-you pages are
 * left out on purpose: they're noindex and redirect anyone without a fresh
 * lead cookie, Googlebot included. Add a path here when you add a page.
 */
const PATHS = [
  "/",
  "/residential",
  "/commercial-and-industrial",
  "/bess",
  "/atap",
  "/products-and-services",
  "/about",
  "/contact",
  "/blog",
  "/ev",
  "/privacy",
];

const absolute = (path: string) => new URL(path, SITE_URL).toString();

/** One entry per page per language, each carrying the same hreflang set the page's own metadata declares. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(
      LOCALES.map((l) => [HTML_LANG[l], absolute(localePath(l, path))]),
    );
    if (path === "/") languages["x-default"] = absolute(localePath(DEFAULT_LOCALE, path));

    return LOCALES.map((locale) => ({
      url: absolute(localePath(locale, path)),
      alternates: { languages },
    }));
  });
}
