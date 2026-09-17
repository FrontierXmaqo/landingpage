/**
 * Line icons for the BESS benefit cards. Drawn locally rather than imported
 * from the C&I page's icon set, so this page's assets stay self-contained.
 * Stroke weight and viewBox match the C&I/EV icon sets.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Frame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" className={className} {...stroke}>
      {children}
    </svg>
  );
}

/** Maximum Demand / Peak Shaving: a load curve with its peak clipped flat. */
export function IconPeakShave({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M3 24h4l4-13 5 16 4-11h9" />
      <path d="M14 8h9" strokeDasharray="2 3" />
    </Frame>
  );
}

/** Lower Energy Costs: a coin with a downward trend. */
export function IconCost({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <circle cx="12" cy="13" r="9" />
      <path d="M12 8v10M9 10.5c0-1.4 1.3-2.5 3-2.5s3 1 3 2.2c0 3-6 1.6-6 4.6 0 1.3 1.3 2.2 3 2.2s3-1 3-2.3" />
      <path d="M22 20l6 4M28 24v-4h-4" />
    </Frame>
  );
}

/** Energy Management: an equalizer of sliders. */
export function IconSliders({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M6 26V16M6 11V6M16 26V19M16 14V6M26 26V21M26 16V6" />
      <circle cx="6" cy="13.5" r="2.5" />
      <circle cx="16" cy="16.5" r="2.5" />
      <circle cx="26" cy="18.5" r="2.5" />
    </Frame>
  );
}

/** Solar Energy Optimisation: sun. */
export function IconSun({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <circle cx="16" cy="16" r="6.5" />
      <path d="M16 2v4M16 26v4M4.5 4.5l2.8 2.8M24.7 24.7l2.8 2.8M2 16h4M26 16h4M4.5 27.5l2.8-2.8M24.7 7.3l2.8-2.8" />
    </Frame>
  );
}

/** Backup / Energy Resilience: shield with a lightning bolt. */
export function IconShieldBolt({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M16 3 5 7v9c0 7 4.7 11.6 11 13 6.3-1.4 11-6 11-13V7L16 3Z" />
      <path d="M18 10 12 18h4l-2 6 7-9h-4l2-5Z" fill="currentColor" stroke="none" />
    </Frame>
  );
}

/** Real-Time Monitoring: a dashboard screen with a live line chart. */
export function IconMonitor({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <rect x="3" y="6" width="26" height="17" rx="2" />
      <path d="M13 28h6M16 23v5" />
      <path d="M7 18l4-5 3 3 5-7 4 4" />
    </Frame>
  );
}

export const BESS_BENEFIT_ICONS = [IconPeakShave, IconCost, IconSliders, IconSun, IconShieldBolt, IconMonitor] as const;
