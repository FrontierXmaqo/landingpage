import type { CSSProperties } from "react";
import styles from "./StoryRoad.module.css";

// Palette lifted from the truck artwork, so the scenes sit in the same world.
const NAVY = "#0b476c";
const CELL = "#6d9fc4";
const ROOF = "#e2772c";
const ROOF_EDGE = "#b85a1d";
const GREEN = "#0d6b4f";
const GLASS = "#b9dcee";

/** Install delay for panel `i` of `n`, and the reverse order for lifting off. */
function timing(i: number, n: number, inMs: number): CSSProperties {
  return { "--in": `${inMs}ms`, "--out": `${(n - 1 - i) * 70}ms` } as CSSProperties;
}

function Glint({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" x2="1">
      <stop offset="0" stopColor="#fff" stopOpacity="0" />
      <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </linearGradient>
  );
}

const HOUSE_PANELS = [40, 58, 76, 94];

export function HouseScene({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 150 116"
      className={className}
      style={{ "--glint-at": "900ms", "--sweep": "124px" } as CSSProperties}
      aria-hidden
    >
      <defs>
        <Glint id="story-house-glint" />
        <clipPath id="story-house-panels">
          {HOUSE_PANELS.map((x) => (
            <rect key={x} x={x} y={28} width={16} height={26} rx={1.5} />
          ))}
        </clipPath>
      </defs>
      <ellipse cx="75" cy="108" rx="62" ry="5" fill="#1d3a2b" opacity="0.1" />
      <circle cx="131" cy="100" r="9" fill="#3f9a5e" />
      <circle cx="141" cy="103" r="6.5" fill="#2f8550" />
      <rect x="24" y="60" width="102" height="46" fill="#f3ece3" />
      <rect x="24" y="100" width="102" height="6" fill="#e1d5c6" />
      <rect x="42" y="76" width="18" height="30" rx="2" fill={GREEN} />
      <circle cx="56" cy="92" r="1.4" fill="#f5c16c" />
      <rect x="76" y="72" width="36" height="20" rx="2" fill={GLASS} stroke="#fff" strokeWidth="3" />
      <path d="M94 72v20M76 82h36" stroke="#fff" strokeWidth="2" />
      <path d="M12 64h126l-26-42H38z" fill={ROOF} />
      <path d="M12 64h126l-2.6-4.5H14.6z" fill={ROOF_EDGE} />
      {HOUSE_PANELS.map((x, i) => (
        <g key={x} className={styles.panel} style={timing(i, HOUSE_PANELS.length, i * 150)}>
          <rect x={x} y={28} width={16} height={26} rx={1.5} fill={NAVY} />
          <path d={`M${x + 8} 28.5v25M${x + 0.5} 36.7h15M${x + 0.5} 45.3h15`} stroke={CELL} strokeWidth="0.7" />
        </g>
      ))}
      <g clipPath="url(#story-house-panels)">
        <path className={styles.glint} d="M16 18h14L14 66H0z" fill="url(#story-house-glint)" />
      </g>
    </svg>
  );
}

// Saw-tooth roof: four teeth rising left to right, each slope carrying two panels.
const TOOTH = 38;
const RISE = 24;
const EAVE = 64;
const SLOPE = Math.hypot(TOOTH, RISE);
const UX = TOOTH / SLOPE;
const UY = -RISE / SLOPE;
const NX = -RISE / SLOPE;
const NY = -TOOTH / SLOPE;
const TEETH = [10, 48, 86, 124];
const ROWS = [3, 23]; // distance up the slope where each row of panels starts

/** A panel lying on a slope, drawn edge-on: `along` up the slope, lifted off it by its rails. */
function slopePanel(x0: number, along: number) {
  const len = 18;
  const lift = 1.2;
  const thick = 5;
  const ax = x0 + UX * along + NX * lift;
  const ay = EAVE + UY * along + NY * lift;
  const pts = [
    [ax, ay],
    [ax + UX * len, ay + UY * len],
    [ax + UX * len + NX * thick, ay + UY * len + NY * thick],
    [ax + NX * thick, ay + NY * thick],
  ];
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

// Lower row first, left to right, then the upper row, with a beat between rows.
const FACTORY_PANELS = ROWS.flatMap((along, row) =>
  TEETH.map((x0, t) => ({ key: `${row}-${t}`, points: slopePanel(x0, along), delay: (row * TEETH.length + t) * 110 + row * 180 })),
);

export function FactoryScene({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 200 124"
      className={className}
      style={{ "--glint-at": "1400ms", "--sweep": "170px" } as CSSProperties}
      aria-hidden
    >
      <defs>
        <Glint id="story-factory-glint" />
        <clipPath id="story-factory-panels">
          {FACTORY_PANELS.map((p) => (
            <polygon key={p.key} points={p.points} />
          ))}
        </clipPath>
      </defs>
      <ellipse cx="100" cy="116" rx="92" ry="5" fill="#1d3a2b" opacity="0.1" />
      <g fill="#b7bfba">
        <circle className={styles.puff} cx="175.5" cy="8" r="6" />
        <circle className={styles.puff} cx="175.5" cy="8" r="6" />
        <circle className={styles.puff} cx="175.5" cy="8" r="6" />
      </g>
      <rect x="169" y="14" width="13" height="56" fill="#aeb8b2" />
      <rect x="169" y="20" width="13" height="5" fill={ROOF} />
      <rect x="10" y="64" width="180" height="48" fill="#e7ece9" />
      <rect x="10" y="106" width="180" height="6" fill="#cfd7d2" />
      <rect x="162" y="60" width="28" height="4" fill="#c3ccc7" />
      {TEETH.map((x0) => (
        <g key={x0}>
          <path d={`M${x0} ${EAVE}L${x0 + TOOTH} ${EAVE - RISE}V${EAVE}z`} fill="#cdd6d1" />
          <path
            d={`M${x0 + TOOTH - 4} ${(EAVE - RISE * ((TOOTH - 4) / TOOTH)).toFixed(1)}L${x0 + TOOTH} ${EAVE - RISE}V${EAVE}H${x0 + TOOTH - 4}z`}
            fill={GLASS}
          />
        </g>
      ))}
      {[20, 46, 72, 98].map((x) => (
        <rect key={x} x={x} y="76" width="18" height="12" rx="1.5" fill={GLASS} />
      ))}
      <rect x="128" y="80" width="28" height="32" fill={GREEN} />
      <path d="M128 86h28M128 92h28M128 98h28M128 104h28" stroke="#0a5a42" strokeWidth="1" />
      {FACTORY_PANELS.map((p, i) => (
        <g key={p.key} className={styles.panel} style={timing(i, FACTORY_PANELS.length, p.delay)}>
          <polygon points={p.points} fill={NAVY} />
        </g>
      ))}
      <g clipPath="url(#story-factory-panels)">
        <path className={styles.glint} d="M8 26h14L10 70H-4z" fill="url(#story-factory-glint)" />
      </g>
    </svg>
  );
}
