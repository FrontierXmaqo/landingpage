import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import SectionTag from "../SectionTag";
import { fill, localePath, type Locale } from "@/lib/i18n";
import type { PublishedCiProject } from "@/lib/publishedContent";
import type { HomeCopy, HomeProject } from "./copy";

const RESIDENTIAL_IMAGES = [
  "/gallery-residential-install.jpg",
  "/hero-rooftop.webp",
  "/projects/surau-at-taqwa.webp",
];

/** Branded stand-in for a CMS project row whose photo has not been set yet. */
function CardFallback({ capacity }: { capacity: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-brand-forest">
      <span className="font-mono text-lg font-semibold tracking-tight text-white/80">{capacity}</span>
    </div>
  );
}

function Card({
  href,
  accent,
  image,
  imageAlt,
  chip,
  left,
  right,
  title,
  body,
  cta,
  lead = false,
  capacity,
}: {
  href: string;
  /** Tailwind classes for this set's accent, applied to chip, metric and CTA. */
  accent: { text: string; border: string };
  image?: string;
  imageAlt: string;
  chip: string;
  left: string;
  right: string;
  title: string;
  body: string;
  cta: string;
  lead?: boolean;
  capacity: string;
}) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-base-line bg-base-panel transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_56px_-34px_rgba(8,26,15,0.55)] ${accent.border}`}
    >
      <div className={`relative overflow-hidden ${lead ? "aspect-[16/11]" : "aspect-[16/10]"}`}>
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <CardFallback capacity={capacity} />
        )}
        <span
          className={`absolute left-3.5 top-3.5 inline-flex items-center rounded-md bg-white/95 px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] ${accent.text}`}
        >
          {chip}
        </span>
      </div>

      <div className={`flex flex-1 flex-col gap-2.5 ${lead ? "p-5 sm:p-6" : "p-5"}`}>
        <p className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-[0.02em] text-base-slate">
          <span>{left}</span>
          <span aria-hidden className="text-base-line">
            ·
          </span>
          <span className={`font-semibold ${accent.text}`}>{right}</span>
        </p>
        <h4 className={`font-bold tracking-tight text-base-ink ${lead ? "text-lg sm:text-xl" : "text-[17px]"}`}>
          <Link href={href} className="after:absolute after:inset-0">
            {title}
          </Link>
        </h4>
        <p className="text-sm leading-snug text-base-slate">{body}</p>
        <p className={`mt-auto flex items-center gap-1.5 pt-3.5 text-[13px] font-semibold ${accent.text}`}>
          {cta}
          <span aria-hidden className="transition group-hover:translate-x-0.5">
            &rarr;
          </span>
        </p>
      </div>
    </article>
  );
}

/**
 * Two labelled sets, each an asymmetric lead-plus-two arrangement, mirrored
 * between them. A flat six-up grid reads as a catalogue; this reads as a
 * portfolio, and the mirroring reinforces that the page serves two audiences.
 *
 * Residential cards are editorial copy (copy.ts). C&I cards come from the same
 * CMS rows the C&I page uses, so a project edited there updates here too.
 * Those rows carry no location field, so the C&I meta line is category and
 * capacity, which is real data rather than an invented address.
 */
export default function FeaturedProjects({
  locale,
  t,
  ciProjects,
}: {
  locale: Locale;
  t: HomeCopy;
  ciProjects: PublishedCiProject[];
}) {
  const resHref = localePath(locale, "/residential");
  const ciHref = localePath(locale, "/commercial-and-industrial");
  const resAccent = { text: "text-brand-green-ink", border: "hover:border-brand-green" };
  const ciAccent = { text: "text-brand-orange-ink", border: "hover:border-brand-orange" };

  const ghost =
    "inline-flex items-center gap-2 rounded-full border border-base-line bg-base-panel px-6 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate";

  const residential: HomeProject[] = t.residentialProjects;

  return (
    <section id="work" className="scroll-mt-20 bg-base-bg py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl">
          <SectionTag>{t.work.eyebrow}</SectionTag>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.work.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-base-slate">{t.work.lede}</p>
        </ScrollReveal>

        {/* Residential: lead card on the left. */}
        <ScrollReveal className="mt-10 sm:mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-base-line pb-4">
            <h3 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-base-ink sm:text-2xl">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-green-ink" />
              {t.work.resHeading}
            </h3>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-base-slate">{t.work.resCount}</p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:gap-5">
            {residential.map((p, i) => (
              <div key={p.title} className={i === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"}>
                <Card
                  href={resHref}
                  accent={resAccent}
                  image={RESIDENTIAL_IMAGES[i]}
                  imageAlt={p.imageAlt}
                  chip={p.chip}
                  left={p.location}
                  right={p.metric}
                  title={p.title}
                  body={p.body}
                  cta={t.work.viewProject}
                  capacity={p.metric}
                  lead={i === 0}
                />
              </div>
            ))}
          </div>

          <p className="mt-6 flex">
            <Link href={resHref} className={ghost}>
              {t.work.seeAllRes}
              <span aria-hidden>&rarr;</span>
            </Link>
          </p>
        </ScrollReveal>

        {/* C&I: the same arrangement, mirrored. */}
        <ScrollReveal className="mt-12 sm:mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-base-line pb-4">
            <h3 className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-base-ink sm:text-2xl">
              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-orange-ink" />
              {t.work.ciHeading}
            </h3>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-base-slate">{t.work.ciCount}</p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:gap-5">
            {ciProjects.map((p, i) => (
              <div
                key={p.client}
                className={
                  i === 0 ? "lg:col-start-6 lg:col-end-13 lg:row-start-1 lg:row-end-3" : "lg:col-span-5"
                }
              >
                <Card
                  href={ciHref}
                  accent={ciAccent}
                  image={p.image}
                  imageAlt={p.imageAlt}
                  chip={p.tag}
                  left={p.tag}
                  right={p.capacity}
                  title={p.client}
                  body={
                    p.summary ||
                    (p.panels
                      ? fill(t.work.ciFallbackBody, { panels: p.panels })
                      : t.work.ciFallbackBodyNoPanels)
                  }
                  cta={t.work.viewProject}
                  capacity={p.capacity}
                  lead={i === 0}
                />
              </div>
            ))}
          </div>

          <p className="mt-6 flex">
            <Link href={ciHref} className={ghost}>
              {t.work.seeAllCi}
              <span aria-hidden>&rarr;</span>
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
