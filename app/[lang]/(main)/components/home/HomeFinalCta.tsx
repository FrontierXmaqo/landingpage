import Link from "next/link";
import { CONTACT } from "@/lib/content";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import type { HomeCopy } from "./copy";

/**
 * The page's closing panel, as drawn in the approved draft.
 *
 * The homepage carries no form of its own, so this panel is where every CTA
 * on the page leads, and its two buttons are the real exits: the residential
 * enquiry form, or the phone. A business visitor reaches the C&I form through
 * the hero's own pathway box, which is the choice the page is built around.
 *
 * The headline is the shared `finalCta` copy from the dictionary, so the site
 * closes on the same sentence in all three languages wherever it appears.
 */
export default function HomeFinalCta({
  locale,
  t,
  shared,
  space,
}: {
  locale: Locale;
  t: HomeCopy["finalCta"];
  shared: Dictionary["finalCta"];
  space: string;
}) {
  return (
    <section id="consultation" className="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-brand-forest to-brand-forest-deep px-6 py-12 text-center sm:px-12 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(60rem_30rem_at_88%_-20%,rgba(249,112,0,0.34),transparent_66%),radial-gradient(48rem_30rem_at_6%_110%,rgba(49,172,71,0.3),transparent_68%)]"
        />

        <h2 className="text-2xl font-bold leading-tight text-white sm:text-4xl">
          {shared.titleLead}
          {space}
          <span className="text-brand-orange">{shared.titleAccent}</span>
          {shared.titleTail}
        </h2>

        <p className="mx-auto mt-4 max-w-[52ch] text-[15px] leading-relaxed text-white/80 sm:text-[17px]">
          {t.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={localePath(locale, "/residential#assessment")}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange-deep px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange-deep/30 transition hover:brightness-95"
          >
            {t.primary}
            <span aria-hidden>&rarr;</span>
          </Link>
          <a
            href={CONTACT.officeHref}
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            {t.secondary}
          </a>
        </div>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/20 pt-6 text-sm text-white/70">
          <span>{t.foot}</span>
          <span>
            {t.emailLabel}{" "}
            <a href={CONTACT.emailHref} className="font-semibold text-white transition hover:text-brand-orange">
              {CONTACT.email}
            </a>
          </span>
        </p>
      </div>
    </section>
  );
}
