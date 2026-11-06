import type { Dictionary } from "@/lib/i18n";
import s from "./BessHeroFlow.module.css";

/**
 * Hero visual: the same four nodes and six routes as the original client
 * diagram (solar, building, TNB grid, battery), but each route only lights
 * up in its time step — day, 3pm peak, night — so it reads at a glance on
 * a phone without a zoom modal. Pure CSS animation, no client JS.
 */

const SOLAR = "#f08c00", BATTERY = "#12a150", GRID = "#3557d6";
const PHASE = [s.p1, s.p2, s.p3];
const PHASE_TEXT = [
  { title: "#1d3d8f", body: "#44557a" },
  { title: "#b45309", body: "#7c4a14" },
  { title: "#ffffff", body: "#c4cee2" },
];
const STEP_BG = ["#1d3d8f", "#c2410c", "#16243f"];

function PhaseIcon({ i }: { i: number }) {
  if (i === 0)
    return (
      <svg viewBox="0 0 30 30" aria-hidden className="h-[30px] w-[30px] shrink-0">
        <circle cx="15" cy="15" r="7" fill="#f59e0b" />
        <path d="M15 2v3M15 25v3M2 15h3M25 15h3M5.8 5.8l2.1 2.1M22.1 22.1l2.1 2.1M24.2 5.8l-2.1 2.1M7.9 22.1l-2.1 2.1" stroke="#f59e0b" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  if (i === 1)
    return (
      <svg viewBox="0 0 30 30" aria-hidden className="h-[30px] w-[30px] shrink-0">
        <path d="M17 2 6 17h8l-2 11 12-16h-8l1-10Z" fill="#ea580c" />
      </svg>
    );
  return (
    <svg viewBox="0 0 30 30" aria-hidden className="h-[30px] w-[30px] shrink-0">
      <path d="M21 19.5A9 9 0 0 1 10.5 7a10 10 0 1 0 10.5 12.5Z" fill="#fde68a" />
    </svg>
  );
}

function NodeLabel({ x, w, text, color, filled = false }: { x: number; w: number; text: string; color: string; filled?: boolean }) {
  return (
    <>
      <rect x={x - w / 2} y={filled ? 384 : 172} width={w} height={30} rx={9} fill={filled ? color : "#fff"} stroke={filled ? undefined : color} strokeWidth={1.8} />
      <text x={x} y={filled ? 404 : 192} textAnchor="middle" fontSize={13} fontWeight={filled ? 800 : 700} fill={filled ? "#fff" : color}>{text}</text>
    </>
  );
}

const marker = (id: string, color: string, size = 3.6) => (
  <marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth={size} markerHeight={size} orient="auto">
    <path d="M0,0 L10,5 L0,10 Z" fill={color} />
  </marker>
);

export default function BessHeroFlow({ t }: { t: Dictionary["bess"]["heroFlow"] }) {
  const a = t.arrows;
  return (
    <div className="grid min-w-0 gap-3.5 rounded-[26px] border border-base-line bg-base-panel p-4 shadow-[0_30px_60px_-32px_rgba(159,18,57,0.35)] sm:p-5">
      <div className={`${s.stack} ${s.sky} rounded-2xl px-4 py-3`}>
        {t.phases.map((p, i) => (
          <div key={p.time} className={`${PHASE[i]} flex items-center gap-3`}>
            <PhaseIcon i={i} />
            <div>
              <p className="text-[17px] font-bold leading-tight" style={{ color: PHASE_TEXT[i].title }}>{p.time}</p>
              <p className="text-sm leading-snug" style={{ color: PHASE_TEXT[i].body }}>{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <svg viewBox="0 56 600 364" role="img" aria-label={t.aria} className="block h-auto w-full" style={{ fontFamily: "var(--font-sans)" }}>
        <defs>
          {marker("hf-s", SOLAR)}
          {marker("hf-b", BATTERY, 3)}
          {marker("hf-g", GRID)}
          <linearGradient id="hf-cell" x1="0" x2="0" y1="1" y2="0">
            <stop offset="0" stopColor="#0b7a3b" />
            <stop offset="1" stopColor="#2fd07a" />
          </linearGradient>
          <filter id="hf-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10" /></filter>
          <clipPath id="hf-clip"><rect x="274" y="294" width="52" height="64" rx="7" /></clipPath>
        </defs>

        {/* the six routes, always visible as tracks */}
        <g stroke="#ece4df" strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M134 110 H242" /><path d="M466 98 H358" /><path d="M358 140 H466" />
          <path d="M80 222 V320 H244" /><path d="M520 222 V320 H356" /><path d="M300 266 V214" />
        </g>

        {/* day: solar → building, solar → battery, spare → TNB */}
        <g className={s.p1}>
          <path className={s.flow} d="M134 110 H236" stroke={SOLAR} markerEnd="url(#hf-s)" />
          <path className={s.flow} d="M80 222 V320 H236" stroke={SOLAR} markerEnd="url(#hf-s)" />
          <path className={s.flow} d="M358 140 H460" stroke={SOLAR} markerEnd="url(#hf-s)" />
          <g className={s.alabel} fontSize="14" fontWeight="600" fill="#c26a00" textAnchor="middle">
            <text x="189" y="96">{a.freePower}</text>
            <text x="160" y="308">{a.fillsBattery}</text>
            <text x="412" y="166">{a.soldToTnb}</text>
          </g>
        </g>
        {/* 3pm peak: battery → building, TNB tops up */}
        <g className={s.p2}>
          <path className={s.flow} d="M300 266 V220" stroke={BATTERY} strokeWidth={7} markerEnd="url(#hf-b)" />
          <path className={s.flow} d="M466 98 H364" stroke={GRID} strokeOpacity={0.55} markerEnd="url(#hf-g)" />
          <g className={s.alabel} fontSize="14" fontWeight="600">
            <text x="314" y="246" fill="#0b7a3b">{a.coversPeak}</text>
            <text x="412" y="84" fill={GRID} textAnchor="middle">{a.tnbTopsUp}</text>
          </g>
        </g>
        {/* night: TNB → battery */}
        <g className={s.p3}>
          <path className={s.flow} d="M520 222 V320 H364" stroke={GRID} markerEnd="url(#hf-g)" />
          <text className={s.alabel} x="440" y="308" fontSize="14" fontWeight="600" fill={GRID} textAnchor="middle">{a.refills}</text>
        </g>

        {/* solar */}
        <rect x="30" y="60" width="100" height="100" rx="20" fill="#f5efe8" />
        <g className={s.sun}>
          <circle cx="58" cy="88" r="11" fill="#f59e0b" />
          <path d="M58 70v4M58 102v4M40 88h4M72 88h4M45 75l3 3M68 98l3 3M71 75l-3 3M48 98l-3 3" stroke="#f59e0b" strokeWidth="3.4" strokeLinecap="round" />
        </g>
        <polygon points="58,146 72,116 118,116 104,146" fill="#26408f" />
        <path d="M69,146 83,116M81,146 95,116M93,146 107,116M65,131 111,131" stroke="#6f8be0" strokeWidth="2" opacity=".9" />
        <NodeLabel x={80} w={96} text={t.nodes.solar} color={SOLAR} />

        {/* building */}
        <rect x="250" y="60" width="100" height="100" rx="20" fill="#f5efe8" />
        <rect x="268" y="96" width="34" height="50" rx="5" fill="#2b3b57" />
        <rect x="300" y="80" width="34" height="66" rx="5" fill="#1f2d47" />
        <rect x="277" y="86" width="7" height="12" rx="2" fill="#2b3b57" />
        <g fill="#ffd166">
          {[[274, 104], [288, 104], [274, 118], [288, 118], [306, 90], [320, 90], [306, 104], [320, 104], [306, 118], [320, 118]].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="7" rx="1.5" />
          ))}
        </g>
        <NodeLabel x={300} w={140} text={t.nodes.building} color="#1f2d47" />

        {/* TNB grid */}
        <rect x="470" y="60" width="100" height="100" rx="20" fill="#f5efe8" />
        <path d="M506 148 L520 74 L534 148 M512 118 H528 M509 133 H531 M515 96 H525 M496 84 H544 M500 98 H540" stroke={GRID} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <NodeLabel x={520} w={104} text={t.nodes.grid} color={GRID} />

        {/* battery */}
        <rect className={s.p2} x="236" y="262" width="128" height="120" rx="26" fill="#2fd07a" filter="url(#hf-soft)" />
        <rect x="244" y="268" width="112" height="108" rx="22" fill="#f5efe8" />
        <rect x="288" y="280" width="24" height="9" rx="3" fill="#0b7a3b" />
        <rect x="268" y="288" width="64" height="76" rx="11" fill="#fff" stroke="#0b7a3b" strokeWidth="4" />
        <g clipPath="url(#hf-clip)"><rect className={s.cell} x="274" y="294" width="52" height="64" fill="url(#hf-cell)" /></g>
        <path d="M303 302 L289 328 H299 L295 350 L312 322 H301 Z" fill="#fff" stroke="#0b7a3b" strokeWidth="2.2" strokeLinejoin="round" />
        <NodeLabel x={300} w={150} text={t.nodes.battery} color={BATTERY} filled />
      </svg>

      <div className="flex gap-2" aria-hidden>
        {t.steps.map((label, i) => (
          <div key={label} className="relative flex-1 overflow-hidden rounded-full border border-base-line px-2 py-1.5 text-center text-[13px] font-semibold text-base-slate">
            <span className={`${PHASE[i]} absolute inset-0 grid place-items-center rounded-full text-white`} style={{ background: STEP_BG[i] }}>{label}</span>
            {label}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-[18px] gap-y-1.5 text-[13px] text-base-slate">
        {t.legend.map((label, i) => (
          <span key={label} className="inline-flex items-center gap-[7px]">
            <i className="inline-block h-1 w-[18px] rounded" style={{ background: [SOLAR, BATTERY, GRID][i] }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
