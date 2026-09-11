"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fades and slides children up once they scroll into view, reusing the
 * existing .animate-fade-in-up keyframe (globals.css) so it inherits the
 * same prefers-reduced-motion guard as the rest of the site.
 */
export default function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${visible ? "animate-fade-in-up" : "opacity-0"} ${className}`}
      style={delayMs ? { animationDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
