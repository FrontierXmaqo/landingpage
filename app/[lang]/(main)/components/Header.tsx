import Image from "next/image";
import Link from "next/link";
import { OLD_SITE_IMAGES } from "@/lib/content";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({
  locale,
  t,
  ctaHref = "#assessment",
}: {
  locale: Locale;
  t: Dictionary;
  /** Where the header's CTA button points. Defaults to a same-page anchor,
   * correct for every page that has its own #assessment form (Residential,
   * EV, C&I). Pages without one (About, ATAP) pass an explicit cross-page
   * link instead — e.g. `localePath(locale, "/#assessment")`. */
  ctaHref?: string;
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-base-line bg-base-panel/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* The wordmark is the way back to the homepage from anywhere on the
            site, which is what visitors reach for first. The alt text names
            the company and the link is what carries the destination, so a
            screen reader hears "MAQO Solar, link" rather than a bare image. */}
        <Link
          href={localePath(locale, "/")}
          className="relative h-9 w-28 shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green-ink sm:h-10 sm:w-36"
        >
          <Image
            src={OLD_SITE_IMAGES.logo}
            alt={t.header.logoAlt}
            fill
            className="object-contain object-left"
            sizes="160px"
            priority
          />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher
            locale={locale}
            label={t.languageSwitcher.label}
            classes={{
              root: "flex items-center",
              links: "hidden items-center rounded-full border border-base-line p-0.5 sm:flex",
              link: "inline-flex min-w-10 items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-semibold text-base-slate transition hover:text-base-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-ink aria-[current=true]:bg-base-ink aria-[current=true]:text-white",
              select:
                "h-9 rounded-full border border-base-line bg-base-panel px-2.5 text-xs font-semibold text-base-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-green sm:hidden",
            }}
          />
          <Link
            href={ctaHref}
            className="inline-flex items-center whitespace-nowrap rounded-full bg-brand-orange-deep px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-95 sm:px-4 sm:text-sm"
          >
            {t.header.cta}
          </Link>
        </div>
      </div>
    </header>
  );
}
