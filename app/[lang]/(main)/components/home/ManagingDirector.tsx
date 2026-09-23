import Image from "next/image";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import type { HomeCopy } from "./copy";

/**
 * The mission line is a person's words, so it is attributed to a face.
 * The portrait source is 192px square and is never drawn larger than that.
 */
export default function ManagingDirector({ locale, t }: { locale: Locale; t: HomeCopy["md"] }) {
  return (
    <figure className="mx-auto mt-[clamp(3rem,5vw,4rem)] grid max-w-6xl items-center gap-6 rounded-3xl border border-base-line bg-base-panel p-6 shadow-[0_1px_2px_rgba(15,23,42,0.05),0_24px_44px_-32px_rgba(8,26,15,0.4)] sm:p-8 md:grid-cols-[auto_1fr] md:gap-10">
      <div className="relative aspect-square w-[clamp(5.5rem,14vw,7rem)] shrink-0">
        <Image
          src="/kong-kok-king.jpg"
          alt={t.portraitAlt}
          width={192}
          height={192}
          className="h-full w-full rounded-full border-[3px] border-base-panel object-cover shadow-[0_0_0_2px_var(--color-brand-green-ink),0_14px_26px_-14px_rgba(8,26,15,0.55)]"
        />
        <span
          aria-hidden
          className="absolute bottom-[8%] right-[4%] h-3.5 w-3.5 rounded-full border-2 border-base-panel bg-brand-orange-deep"
        />
      </div>

      <div className="grid gap-3.5">
        <blockquote className="text-[clamp(1.0625rem,2vw,1.375rem)] font-medium leading-snug tracking-tight text-base-ink">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <figcaption>
            <span className="block text-[15px] font-semibold text-base-ink">{t.name}</span>
            <span className="block font-mono text-xs uppercase tracking-[0.08em] text-base-slate">{t.role}</span>
          </figcaption>
          <Link
            href={localePath(locale, "/about")}
            className="group ml-auto inline-flex items-center gap-3 rounded-full border border-base-line py-1.5 pl-4 pr-1.5 text-sm font-semibold text-brand-green-ink transition hover:border-brand-green-ink"
          >
            {t.aboutCta}
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full bg-brand-green-ink/10 transition group-hover:bg-brand-green-ink group-hover:text-white"
            >
              <span className="transition group-hover:translate-x-0.5">&rarr;</span>
            </span>
          </Link>
        </div>
      </div>
    </figure>
  );
}
