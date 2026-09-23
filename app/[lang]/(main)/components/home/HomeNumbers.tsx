"use client";

import { useEffect, useRef } from "react";
import type { HomeCopy } from "./copy";

/**
 * Parses "1,000+" into the pieces needed to count it up and print it back
 * the way it was written. Decimals and a unit suffix survive too
 * ("10.25 MWp"), as would a leading "RM".
 */
function parse(text: string) {
  const match = /^(\D*?)([\d,]+(?:\.\d+)?)(.*)$/.exec(text);
  if (!match) return null;
  const digits = match[2];
  const dot = digits.indexOf(".");
  return {
    pre: match[1],
    post: match[3],
    target: Number(digits.replace(/,/g, "")),
    decimals: dot === -1 ? 0 : digits.length - dot - 1,
    grouped: digits.includes(","),
  };
}

function format(value: number, p: NonNullable<ReturnType<typeof parse>>) {
  let out = value.toFixed(p.decimals);
  if (p.grouped) {
    const [whole, fraction] = out.split(".");
    out = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (fraction ? `.${fraction}` : "");
  }
  return p.pre + out + p.post;
}

/**
 * Counts one figure up the first time it is scrolled into view.
 *
 * The finished value is what the server renders, so a visitor with no JS, a
 * crawler, or anyone who never scrolls this far still reads the real number.
 * The animation only ever moves towards what is already on the page, and is
 * skipped outright under prefers-reduced-motion.
 */
function CountUpFigure({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parsed = parse(value);
    if (!parsed) return;

    let frame = 0;
    let started: number | null = null;
    const DURATION = 1600;

    const step = (now: number) => {
      if (started === null) started = now;
      const progress = Math.min((now - started) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(eased * parsed.target, parsed);
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.45 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      // Whatever the animation was mid-way through printing, the committed
      // value is the real one.
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className="font-mono text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-none tracking-[-0.035em] text-base-ink tabular-nums">
      {value}
    </span>
  );
}

export default function HomeNumbers({ t }: { t: HomeCopy["numbers"] }) {
  return (
    <section
      aria-labelledby="home-numbers-title"
      className="home-numbers-band border-b border-base-line border-t-[3px] border-t-brand-green py-[clamp(2.25rem,4.5vw,3rem)]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <h2
            id="home-numbers-title"
            className="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-base-slate"
          >
            <span aria-hidden className="h-0.5 w-7 shrink-0 bg-brand-orange-deep" />
            {t.eyebrow}
          </h2>
          <p className="text-[13px] text-base-slate">{t.note}</p>
        </div>

        <dl className="mt-[clamp(1.5rem,3vw,2rem)] grid gap-6 sm:grid-cols-3 sm:gap-0">
          {t.items.map((item, i) => (
            <div
              key={item.label}
              className={`grid content-start gap-2.5 ${
                i === 0
                  ? "sm:pr-[clamp(1.25rem,3.5vw,3rem)]"
                  : i === t.items.length - 1
                    ? "sm:border-l sm:border-base-line sm:pl-[clamp(1.25rem,3.5vw,3rem)]"
                    : "sm:border-l sm:border-base-line sm:px-[clamp(1.25rem,3.5vw,3rem)]"
              }`}
            >
              <span aria-hidden className="h-0.5 w-7 bg-brand-green" />
              {/* The figure is the term and its wording is the description,
                  which is the way a stat reads out loud: "1,000+, residential
                  systems commissioned". */}
              <dt>
                <CountUpFigure value={item.value} />
              </dt>
              <dd className="max-w-[22ch] text-[13px] leading-snug text-base-slate">{item.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
