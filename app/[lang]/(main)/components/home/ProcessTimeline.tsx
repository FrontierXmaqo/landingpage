import ScrollReveal from "../ScrollReveal";
import SectionTag from "../SectionTag";
import type { HomeCopy } from "./copy";

/**
 * How it works, drawn as a timeline rather than five tiles: the stations sit
 * on one line so the order, and the gaps between phases, read at a glance.
 * Steps alternate above and below the line from 60rem up; below that the same
 * line turns vertical. The spine and the alternation live in globals.css
 * (.home-flow*), because neither is expressible in utilities.
 *
 * The numbering is real information here, not decoration: this is a sequence
 * a customer moves through in order.
 */
export default function ProcessTimeline({ t }: { t: HomeCopy["process"] }) {
  // Green at the start of the journey, orange by the end, matching the two
  // audiences' accents and the spine gradient behind the nodes.
  const accents = [
    "text-brand-green-deep",
    "text-brand-green-deep",
    "text-brand-green-deep",
    "text-brand-orange-ink",
    "text-brand-orange-deep",
  ];

  return (
    <section
      id="process"
      className="home-process-band scroll-mt-20 border-y border-base-line py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="max-w-3xl">
          <SectionTag>{t.eyebrow}</SectionTag>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-base-slate">{t.lede}</p>
        </ScrollReveal>

        <ScrollReveal>
          <ol className="home-flow relative mt-[clamp(2.5rem,5vw,4rem)] grid items-stretch gap-0 lg:grid-cols-5 lg:gap-x-2">
            {t.steps.map((step, i) => (
              <li
                key={step.title}
                className={`home-flow-step relative z-[1] grid grid-cols-[auto_1fr] gap-4 pb-7 lg:grid-cols-none lg:gap-0 lg:pb-0 ${accents[i]}`}
              >
                <div className="home-flow-card relative grid gap-1.5 text-left lg:text-center">
                  <p className="font-mono text-[11px] uppercase tracking-[0.1em]">{step.when}</p>
                  <h3 className="text-base font-bold tracking-tight text-base-ink">{step.title}</h3>
                  <p className="text-sm leading-snug text-base-slate">{step.body}</p>
                </div>

                <span
                  aria-hidden
                  className={`home-flow-node order-first grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-current font-mono text-[13px] font-semibold lg:order-none ${
                    // The last station is filled rather than outlined: support
                    // does not end. Only ever one background class, so the two
                    // never race each other in the cascade.
                    i === t.steps.length - 1 ? "bg-brand-orange-deep text-white" : "bg-base-panel"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        </ScrollReveal>
      </div>
    </section>
  );
}
