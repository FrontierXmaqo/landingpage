import Image from "next/image";
import type { HomeCopy } from "./copy";

/**
 * The mission line is a person's words, so it is attributed to a face.
 * The portrait source is 192px square and is never drawn larger than that.
 */
export default function ManagingDirector({ t }: { t: HomeCopy["md"] }) {
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
        <figcaption>
          <span className="block text-[15px] font-semibold text-base-ink">{t.name}</span>
          <span className="block font-mono text-xs uppercase tracking-[0.08em] text-base-slate">{t.role}</span>
        </figcaption>
      </div>
    </figure>
  );
}
