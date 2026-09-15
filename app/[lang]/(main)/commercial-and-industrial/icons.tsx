/**
 * Line icons for the C&I page. Drawn here rather than pulled from an icon
 * package: the rest of this codebase ships its own SVGs (see the EV page), and
 * a dependency for eight glyphs is not worth the bytes or the audit surface.
 * Stroke weight and cap style match the EV page's icon set.
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

/** Solid check in a circle — used inline with the hero value props. */
export function CheckCircle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className={className} fill="currentColor">
      <path d="M10 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Zm4.05 6.2-4.9 5.2a.9.9 0 0 1-1.3.02L5.93 10.9a.9.9 0 1 1 1.28-1.26l1.27 1.29 4.26-4.52a.9.9 0 1 1 1.31 1.23Z" />
    </svg>
  );
}

export function IconTax({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M8 3h13l4 4v22H8z" />
      <path d="M21 3v4h4" />
      <path d="M13 12h7M13 17h7M13 22h4" />
      <path d="M3 9v20a2 2 0 0 0 2 2h18" />
    </Frame>
  );
}

export function IconWallet({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M4 9a3 3 0 0 1 3-3h17v5" />
      <rect x="4" y="9" width="24" height="18" rx="3" />
      <path d="M28 16h-5a3 3 0 0 0 0 6h5" />
    </Frame>
  );
}

export function IconShield({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M16 3 5 7v9c0 7 4.7 11.6 11 13 6.3-1.4 11-6 11-13V7L16 3Z" />
      <path d="m11.5 15.8 3.2 3.2 6-6.2" />
    </Frame>
  );
}

export function IconGear({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <circle cx="16" cy="16" r="4.2" />
      <path d="M26 16a10 10 0 0 0-.14-1.66l2.6-1.9-2.5-4.33-3 1.17a10 10 0 0 0-2.88-1.67L19.6 4.3h-5l-.48 3.31a10 10 0 0 0-2.88 1.67l-3-1.17-2.5 4.33 2.6 1.9a10.1 10.1 0 0 0 0 3.32l-2.6 1.9 2.5 4.33 3-1.17a10 10 0 0 0 2.88 1.67l.48 3.31h5l.48-3.31a10 10 0 0 0 2.88-1.67l3 1.17 2.5-4.33-2.6-1.9c.09-.54.14-1.1.14-1.66Z" />
    </Frame>
  );
}

export function IconFactory({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M4 28V14l8 5V14l8 5V9h8v19z" />
      <path d="M2 28h28" />
      <path d="M24 14h2M24 19h2" />
    </Frame>
  );
}

export function IconWarehouse({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M3 28V12L16 5l13 7v16" />
      <path d="M1 28h30" />
      <path d="M10 28v-9h12v9" />
      <path d="M10 23h12" />
    </Frame>
  );
}

export function IconStorefront({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M4 12h24v16H4z" />
      <path d="M2 28h28" />
      <path d="M4 12 6 5h20l2 7" />
      <path d="M13 28v-8h6v8" />
    </Frame>
  );
}

/** Maps a project's industry tag to its glyph. */
export const PROJECT_ICONS = {
  Manufacturing: IconFactory,
  "Logistics & Warehousing": IconWarehouse,
  "Retail & Commercial": IconStorefront,
} as const;

export const PILLAR_ICONS = {
  tax: IconTax,
  wallet: IconWallet,
  shield: IconShield,
  gear: IconGear,
} as const;
