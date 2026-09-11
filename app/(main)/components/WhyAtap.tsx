import Image from "next/image";
import SectionTag from "./SectionTag";
import ScrollReveal from "./ScrollReveal";
import { WHY_ATAP, OLD_SITE_IMAGES } from "@/lib/content";

// One glyph per benefit, each tied to what the item actually says: a quote document,
// electricity, and protection over time.
const ICONS = [
  <svg key="doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-full w-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6M9 17h6M9 9h2" />
  </svg>,
  <svg key="bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-full w-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 2 4.5 13.5H11L10 22l9.5-13.5H13V2Z" />
  </svg>,
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-full w-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 19 6v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
  </svg>,
];

export default function WhyAtap() {
  const featured = WHY_ATAP[3];
  const rest = [WHY_ATAP[0], WHY_ATAP[1], WHY_ATAP[2]];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <ScrollReveal className="max-w-xl">
        <SectionTag>Why ATAP</SectionTag>
        <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
          Simple to own.{" "}
          <span className="text-brand-orange-ink">Built to last.</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-base-slate">
          The parts of a solar purchase that usually go wrong are the parts we refuse to hand
          to anyone else.
        </p>
      </ScrollReveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:grid-rows-3">
        {/* Certification leads: it is the claim everything else rests on, so it gets the photo */}
        <ScrollReveal className="lg:col-span-2 lg:row-span-3">
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={OLD_SITE_IMAGES.gallery[7]}
              alt="MAQO Solar licensed crew installation work on a Malaysian rooftop"
              fill
              className="object-cover transition duration-700 hover:scale-105"
              sizes="(min-width: 1024px) 680px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-base-ink/95 via-base-ink/55 to-base-ink/20" />
            <div className="relative flex h-full flex-col justify-end p-7 sm:p-9">
              <span className="inline-flex w-fit items-center rounded-full bg-base-panel/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white ring-1 ring-white/25 backdrop-blur-sm">
                Licensed in-house
              </span>
              <h3 className="mt-4 max-w-md text-2xl font-bold leading-tight text-white sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
                {featured.body}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {rest.map((item, i) => (
          <ScrollReveal key={item.title} delayMs={120 + i * 90}>
            <div className="h-full rounded-2xl border border-base-line bg-base-panel p-6 transition hover:border-brand-green hover:shadow-md">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-brand-green-ink">
                {ICONS[i]}
              </span>
              <h3 className="mt-4 text-base font-semibold text-base-ink">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-base-slate">{item.body}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
