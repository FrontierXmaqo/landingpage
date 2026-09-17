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

export function IconCar({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M4 22v-5.5L7 9h18l3 7.5V22" />
      <path d="M4 16.5h24" />
      <path d="M4 22h24v3h-4v-3M8 25v-3H4" />
      <circle cx="9.5" cy="19.5" r="1.4" />
      <circle cx="22.5" cy="19.5" r="1.4" />
    </Frame>
  );
}

export function IconSchool({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="m16 4 13 5.5L16 15 3 9.5 16 4Z" />
      <path d="M8 12v7c0 2.8 3.6 5 8 5s8-2.2 8-5v-7" />
      <path d="M27 10v7" />
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

export function IconMosque({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M11 28V15a5 5 0 0 1 10 0v13" />
      <path d="M16 10V7" />
      <path d="M7 28V14h4M25 28V14h-4" />
      <path d="M5 28h22" />
      <path d="M14 28v-5a2 2 0 0 1 4 0v5" />
    </Frame>
  );
}

export function IconSolarFarm({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M3 17h12l-2 7H5l-2-7ZM17 17h12l-2 7h-8l-2-7Z" />
      <path d="M3.7 20.5h10.6M17.7 20.5h10.6" />
      <path d="M9 17V8M23 17V8" />
      <path d="M6 5h20" />
    </Frame>
  );
}


/** Carousel and dialog controls. */
export function IconChevron({ className, direction = "right" }: { className?: string; direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      className={className}
      {...stroke}
      strokeWidth={2}
      style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" className={className} {...stroke} strokeWidth={2}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconPause({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className={className} fill="currentColor">
      <rect x="7" y="5" width="3.5" height="14" rx="1.2" />
      <rect x="13.5" y="5" width="3.5" height="14" rx="1.2" />
    </svg>
  );
}

export function IconPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8 5.2a1 1 0 0 1 1.5-.87l9 6.8a1 1 0 0 1 0 1.74l-9 6.8A1 1 0 0 1 8 18.8V5.2Z" />
    </svg>
  );
}

export function IconBuilding({ className }: { className?: string }) {
  return (
    <Frame className={className}>
      <path d="M6 28V6h13v22" />
      <path d="M19 13h7v15" />
      <path d="M3 28h26" />
      <path d="M10 11h5M10 16h5M10 21h5M22 18h1M22 23h1" />
    </Frame>
  );
}

/** Maps a project's industry tag to its glyph. */
export const PROJECT_ICONS = {
  Factory: IconFactory,
  "Car Showroom": IconCar,
  School: IconSchool,
  Shoplot: IconStorefront,
  Mosque: IconMosque,
  "Solar Farm": IconSolarFarm,
} as const;

export type ProjectTag = keyof typeof PROJECT_ICONS;

/**
 * Icon for a project's category.
 *
 * Categories are free text in the CMS so marketing can add one we never
 * anticipated ("Hospital", "Data Centre"); anything unrecognised gets the
 * generic building rather than no icon at all. Written as a component rather
 * than a function returning one, so the icon is chosen during render instead
 * of a new component type being produced on every pass.
 */
export function ProjectIcon({ tag, className }: { tag: string; className?: string }) {
  switch (tag) {
    case "Factory":
      return <IconFactory className={className} />;
    case "Car Showroom":
      return <IconCar className={className} />;
    case "School":
      return <IconSchool className={className} />;
    case "Shoplot":
      return <IconStorefront className={className} />;
    case "Mosque":
      return <IconMosque className={className} />;
    case "Solar Farm":
      return <IconSolarFarm className={className} />;
    default:
      return <IconBuilding className={className} />;
  }
}

export const PILLAR_ICONS = {
  tax: IconTax,
  wallet: IconWallet,
  shield: IconShield,
  gear: IconGear,
} as const;
