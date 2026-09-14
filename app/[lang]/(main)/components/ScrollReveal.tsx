/**
 * Fades and lifts children into view. Driven entirely by CSS (.reveal-on-scroll), so the
 * content is never hidden behind a JS observer that might not fire. `delayMs` staggers
 * siblings: under a scroll-driven timeline it shifts the reveal range, otherwise it is a
 * plain animation delay.
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
  const shift = Math.min(delayMs / 15, 20);

  return (
    <div
      className={`reveal-on-scroll ${className}`}
      style={
        delayMs
          ? ({
              animationDelay: `${delayMs}ms`,
              "--reveal-shift": `${shift}%`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
