"use client";

import { useEffect, useState } from "react";

const WORDS = ["career", "craft", "skills", "future", "team"];

/** The headline's changing word. Static under reduced motion; the first word is what no-JS and crawlers see. */
export default function RotatingWord() {
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setOut(true);
      swap = setTimeout(() => {
        setI((n) => (n + 1) % WORDS.length);
        setOut(false);
      }, 450);
    }, 2400);
    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
  }, []);

  return (
    <span className="relative inline-block text-brand-orange-ink sm:whitespace-nowrap">
      <span className={`inline-block transition duration-500 ${out ? "-translate-y-2 opacity-0" : ""}`}>{WORDS[i]}</span>
      <span aria-hidden className="absolute inset-x-[-0.06em] bottom-[0.04em] -z-10 h-[0.2em] rounded-full bg-brand-orange opacity-60" />
    </span>
  );
}
