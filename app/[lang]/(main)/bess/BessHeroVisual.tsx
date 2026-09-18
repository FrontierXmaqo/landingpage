import type { Dictionary } from "@/lib/i18n";

/**
 * Replaces the old battery-charge-level graphic: a clear "3 sources feed one
 * facility" flow diagram (Solar Panel, BESS, TNB Grid), each on its own
 * straight lane so nothing crosses, converging on a single bus bar before
 * one arrow drops into "Your Facility" — reads like a one-line electrical
 * diagram, which happens to fit the subject.
 */

function SolarPanelIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      <path d="M18 40 L14 53 L20 53 L24 40 Z" fill="var(--color-brand-orange-ink)" />
      <path d="M40 40 L44 53 L38 53 L34 40 Z" fill="var(--color-brand-orange-ink)" />
      <g transform="skewX(-9)">
        <rect x="8" y="11" width="42" height="29" rx="3" fill="var(--color-chart-2)" />
        <line x1="8" y1="20.3" x2="50" y2="20.3" stroke="#fff" strokeWidth="1.7" />
        <line x1="8" y1="29.6" x2="50" y2="29.6" stroke="#fff" strokeWidth="1.7" />
        <line x1="22.7" y1="11" x2="22.7" y2="40" stroke="#fff" strokeWidth="1.7" />
        <line x1="36.3" y1="11" x2="36.3" y2="40" stroke="#fff" strokeWidth="1.7" />
      </g>
      <circle cx="52" cy="9" r="4.5" fill="var(--color-chart-2)" />
      <g stroke="var(--color-chart-2)" strokeWidth="1.8" strokeLinecap="round">
        <line x1="52" y1="-1" x2="52" y2="1.5" />
        <line x1="60" y1="3" x2="57.5" y2="5.2" />
        <line x1="62" y1="9" x2="59" y2="9" />
      </g>
    </svg>
  );
}

function BessIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      <rect x="9" y="49" width="46" height="5" rx="2.5" fill="var(--color-brand-green-deep)" opacity="0.35" />
      <rect x="12" y="16" width="17" height="34" rx="4" fill="var(--color-brand-green-deep)" />
      <rect x="33" y="21" width="17" height="29" rx="4" fill="var(--color-chart-1)" />
      <rect x="16" y="20" width="9" height="3.4" rx="1.2" fill="#fff" opacity="0.85" />
      <rect x="37" y="25" width="9" height="3.4" rx="1.2" fill="#fff" opacity="0.85" />
      <path d="M22.5 27 L17 39 L21.5 39 L19 47 L27.5 35 L23 35 Z" fill="#fff" />
      <path d="M43.5 30 L38 41 L42 41 L40 48 L47.5 37 L43.5 37 Z" fill="#fff" opacity="0.9" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      <path d="M4 60 h56" stroke="var(--color-chart-5)" strokeWidth="2.2" strokeLinecap="round" opacity="0.35" />
      <g stroke="var(--color-chart-5)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M32 6 L21 58 M32 6 L43 58" />
        <path d="M25 24 L39 24 M23 35 L41 35 M21 46 L43 46" />
        <path d="M13 16 L51 16" />
        <path d="M6 12 L13 16 L6 20 M58 12 L51 16 L58 20" />
      </g>
      <circle cx="13" cy="16" r="2.4" fill="var(--color-chart-5)" />
      <circle cx="51" cy="16" r="2.4" fill="var(--color-chart-5)" />
    </svg>
  );
}

function FacilityIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden>
      <path d="M6 21V9h9v12" />
      <path d="M15 13h6v8" />
      <path d="M3 21h18" />
      <path d="M9 12h1M9 15h1M9 18h1M18 17h1" />
    </svg>
  );
}

const TILE_DEFS = [
  { key: "solar", tint: "bg-brand-orange-tint", Icon: SolarPanelIcon },
  { key: "bess", tint: "bg-brand-green-tint", Icon: BessIcon },
  { key: "grid", tint: "bg-[color-mix(in_srgb,var(--color-chart-5)_12%,white)]", Icon: GridIcon },
] as const;

export default function BessHeroVisual({ t }: { t: Dictionary["bess"]["heroVisual"] }) {
  return (
    <div className="relative rounded-2xl border border-base-line bg-base-panel p-6 shadow-xl sm:p-7">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-bold text-base-ink">{t.title}</span>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-orange-tint px-2.5 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-orange-ink" />
          <span className="text-[10px] font-bold uppercase tracking-wide text-brand-orange-ink">{t.liveFlow}</span>
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {TILE_DEFS.map(({ key, tint, Icon }, i) => (
          <div key={key} className="text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl sm:h-20 sm:w-20 ${tint}`}>
              <Icon />
            </div>
            <p className="mt-2.5 text-xs font-bold text-base-ink sm:text-sm">{t.tiles[i].label}</p>
            <p className="mt-0.5 text-[10.5px] leading-snug text-base-slate sm:text-[11px]">{t.tiles[i].caption}</p>
          </div>
        ))}
      </div>

      {/* Each tile drops a straight, labelled line to a shared bus bar, then
          one arrow continues down — nothing crosses, so the flow reads
          left-to-right, top-to-bottom without tracing curved paths. */}
      <svg viewBox="0 0 300 92" className="mx-auto mt-1 block w-full max-w-[300px]" aria-hidden>
        <line x1="50" y1="0" x2="50" y2="30" stroke="var(--color-chart-2)" strokeWidth="2" />
        <text x="50" y="42" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--color-brand-orange-ink)">
          {t.lanes[0]}
        </text>

        <line x1="150" y1="0" x2="150" y2="30" stroke="var(--color-chart-1)" strokeWidth="2" />
        <text x="150" y="42" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--color-brand-green-ink)">
          {t.lanes[1]}
        </text>

        <line x1="250" y1="0" x2="250" y2="30" stroke="var(--color-chart-5)" strokeWidth="2" />
        <text x="250" y="42" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="var(--color-chart-5)">
          {t.lanes[2]}
        </text>

        <path d="M50,50 H250" stroke="var(--color-base-ink)" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
        <line x1="50" y1="50" x2="50" y2="43" stroke="var(--color-base-ink)" strokeWidth="1.6" opacity="0.6" />
        <line x1="150" y1="50" x2="150" y2="43" stroke="var(--color-base-ink)" strokeWidth="1.6" opacity="0.6" />
        <line x1="250" y1="50" x2="250" y2="43" stroke="var(--color-base-ink)" strokeWidth="1.6" opacity="0.6" />

        <defs>
          <marker id="bess-hero-arrow" markerWidth="8" markerHeight="8" refX="5.5" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-base-ink)" />
          </marker>
        </defs>
        <line x1="150" y1="50" x2="150" y2="80" stroke="var(--color-base-ink)" strokeWidth="2" markerEnd="url(#bess-hero-arrow)" />
      </svg>

      <div className="mx-auto flex max-w-[220px] items-center justify-center gap-2.5 rounded-2xl bg-base-ink px-4 py-3 shadow-lg">
        <FacilityIcon />
        <div className="text-left">
          <p className="text-xs font-bold text-white sm:text-sm">{t.facilityTitle}</p>
          <p className="text-[10px] text-white/70">{t.facilitySubtitle}</p>
        </div>
      </div>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-base-slate">{t.footer}</p>
    </div>
  );
}
