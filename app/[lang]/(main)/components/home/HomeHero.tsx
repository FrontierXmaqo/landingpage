import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { CONTACT } from "@/lib/content";
import type { HomeCopy } from "./copy";

/**
 * The homepage hero: two photographs, one per audience, clipped either side
 * of a raked seam. Pointing at either pathway box below swings the seam,
 * widens that audience's photograph, dims the other and turns the box
 * square-on. All of that is CSS (`:has()` plus three registered custom
 * properties in globals.css), so this stays a server component with no
 * hydration cost.
 *
 * The photographs are decorative: the boxes carry the same meaning in text.
 */
export default function HomeHero({ locale, t }: { locale: Locale; t: HomeCopy }) {
  const boxBase =
    "home-box relative isolate flex flex-col gap-3 overflow-hidden rounded-2xl border border-base-line bg-base-panel p-6 text-base-ink sm:p-7 lg:p-8";

  return (
    <section className="home-hero relative z-10 isolate overflow-hidden bg-brand-forest text-white">
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="home-half home-half-res">
          <span className="home-half-img absolute inset-0 block overflow-hidden">
            <Image
              src="/home-hero-residential.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </span>
        </div>
        <div className="home-half home-half-ci">
          <span className="home-half-img absolute inset-0 block overflow-hidden">
            <Image
              src="/projects/spritzer.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-[72%_50%]"
            />
          </span>
        </div>
      </div>

      <div aria-hidden className="home-hero-sun pointer-events-none absolute inset-0 z-[1]" />
      <div aria-hidden className="home-hero-plate pointer-events-none absolute inset-0 z-[2]" />
      <div aria-hidden className="home-hero-grid pointer-events-none absolute inset-0 z-[3]" />
      <div aria-hidden className="home-seam pointer-events-none absolute inset-0 z-[4]" />
      <div aria-hidden className="home-seam-glow pointer-events-none absolute inset-0 z-[4]" />

      {/* The plant, annotated the way a drawing is. */}
      <p className="home-note absolute right-4 top-[clamp(5rem,11vh,7rem)] z-10 hidden border-l border-white/35 pl-3.5 font-mono text-[11px] uppercase leading-[1.8] tracking-[0.1em] text-white/70 lg:block xl:right-12">
        <b className="block font-semibold tracking-[0.06em] text-white">{t.hero.note.title}</b>
        {t.hero.note.meta}
      </p>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-[clamp(2rem,4.5vh,3.5rem)] pt-[clamp(2.25rem,6vh,4.5rem)] sm:px-6">
        <div className="home-copy grid max-w-[42rem] gap-[clamp(0.875rem,1.9vh,1.375rem)]">
          <p className="section-eyebrow flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand-orange-deep" />
            {t.hero.eyebrow}
          </p>

          <h1 className="text-[clamp(2.25rem,min(6.4vw,8vh),4.5rem)] font-bold leading-[1.03] tracking-[-0.04em] text-white [text-shadow:0_2px_28px_rgba(6,26,14,0.45)]">
            <span className="block">{t.hero.titleLine1}</span>
            <span className="block">
              {t.hero.titleLine2Lead}
              <span className="home-hl">{t.hero.titleAccent}</span>
              {t.hero.titleTail}
            </span>
          </h1>

          <p className="max-w-[44ch] text-[clamp(0.9375rem,1.4vw,1.0625rem)] leading-relaxed text-white/85">
            {t.hero.sub}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="#consultation"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange-deep px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange-deep/30 transition hover:brightness-95"
            >
              {t.hero.primaryCta}
              <span aria-hidden>&rarr;</span>
            </a>
            <a
              href={CONTACT.officeHref}
              className="border-b border-white/40 pb-0.5 text-sm font-semibold text-white transition hover:border-brand-orange hover:text-brand-orange"
            >
              {t.hero.tel}
            </a>
          </div>
        </div>

        <p className="home-prompt mt-[clamp(2rem,5vh,3.25rem)] flex items-center gap-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">
          <span aria-hidden className="h-px flex-1 bg-white/25" />
          {t.hero.prompt}
          <span aria-hidden className="h-px flex-1 bg-white/25" />
        </p>

        <div className="home-boxes mt-[clamp(1rem,2.4vh,1.5rem)] grid gap-4 lg:grid-cols-2 lg:gap-6">
          <article id="residential" className={`${boxBase} home-box-res scroll-mt-24`}>
            <span aria-hidden className="home-box-rail absolute inset-y-0 left-0 w-[5px] bg-brand-green-ink" />
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-green-ink">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-brand-green-ink" />
              {t.paths.res.who}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-base-ink sm:text-2xl">
              <Link href={localePath(locale, "/residential")} className="after:absolute after:inset-0">
                {t.paths.res.title}
              </Link>
            </h2>
            <p className="text-[15px] leading-snug text-base-slate">{t.paths.res.desc}</p>
            <p className="mt-auto flex items-center justify-between gap-4 border-t border-base-line pt-3.5 text-sm font-semibold text-brand-green-ink">
              {t.paths.res.cta}
              <span aria-hidden className="text-xl">&rarr;</span>
            </p>
          </article>

          <article id="commercial" className={`${boxBase} home-box-ci scroll-mt-24`}>
            <span aria-hidden className="home-box-rail absolute inset-y-0 left-0 w-[5px] bg-brand-orange-ink" />
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-orange-ink">
              <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-brand-orange-ink" />
              {t.paths.ci.who}
            </p>
            <h2 className="text-xl font-bold tracking-tight text-base-ink sm:text-2xl">
              <Link
                href={localePath(locale, "/commercial-and-industrial")}
                className="after:absolute after:inset-0"
              >
                {t.paths.ci.title}
              </Link>
            </h2>
            <p className="text-[15px] leading-snug text-base-slate">{t.paths.ci.desc}</p>
            <p className="mt-auto flex items-center justify-between gap-4 border-t border-base-line pt-3.5 text-sm font-semibold text-brand-orange-ink">
              {t.paths.ci.cta}
              <span aria-hidden className="text-xl">&rarr;</span>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
