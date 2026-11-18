"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a stat up from zero the first time it scrolls into view.
 *
 * Values arrive as display strings ("10+", "100%", "1,071 kWp"), so the first
 * run of digits is animated and whatever surrounds it is kept verbatim. A value
 * with no digits, or a visitor who asked for reduced motion, renders as-is.
 *
 * The server HTML and the first client render always carry the final value, so
 * crawlers and no-JS visitors see the real figure. A stat already on screen at
 * load is left alone rather than flashing back to 0.
 */
const DURATION_MS = 4000;

export default function CountUpStat({ value, className }: { value: string; className?: string }) {
  const match = value.match(/[\d,]*\d/);
  const target = match ? Number(match[0].replace(/,/g, "")) : null;
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(target);

  useEffect(() => {
    const node = ref.current;
    if (node === null || target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let first = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (first) {
          first = false;
          // Any part already visible at load: keep the final value, no 0 flash.
          const r = entry.boundingClientRect;
          if (r.bottom > 0 && r.top < window.innerHeight) {
            observer.disconnect();
            return;
          }
          // Off screen: drop to 0 out of sight, ready to count up.
          setCount(0);
        }
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1);
          // Ease-out cubic: fast off the mark, settles gently on the figure.
          setCount(Math.round(target * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  if (target === null || count === null || match === null) {
    return <span className={className}>{value}</span>;
  }

  // At rest show the value verbatim, so "1000+" is not reformatted to "1,000+".
  const rendered =
    count === target
      ? value
      : value.slice(0, match.index) + count.toLocaleString("en-MY") + value.slice(match.index! + match[0].length);

  return (
    <span ref={ref} className={className}>
      {/* Screen readers get the final figure once, not every frame. */}
      <span aria-hidden="true">{rendered}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
