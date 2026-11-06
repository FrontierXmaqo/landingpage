"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n";
import styles from "./MdChart.module.css";

type T = Dictionary["bess"]["mdChart"];

const RATE = 97.06; // TNB MV ToU: RM30.19 capacity + RM66.87 network per kW of MD
const YMAX = 1200;
// Example factory: highest 30-min kW of each day; weekends dip, spike on day 25
const PEAK = [742,768,781,756,733,498,462,771,795,812,838,790,505,470,760,802,826,810,784,512,476,798,844,866,1020,812,520,481,776,758];
// Day 25 in 30-minute blocks (00:00 … 23:30); block 30 = 15:00–15:30 is the month's MD
const DAY = [360,350,345,340,338,335,340,345,350,360,370,380,420,480,560,640, 720,760,790,800,810,820,815,800,
             690,700,820,860, 900,950,1020,980, 930,880,850,820, 700,600,520,480, 450,430,420,410,400,390,380,370];
const MD0 = Math.max(...PEAK);
const MD_DAY = PEAK.indexOf(MD0) + 1;
const DAY_MAX_I = DAY.indexOf(Math.max(...DAY));

const C = { bess: "#1670d4", bessSoft: "rgba(22,112,212,.13)", md: "#d61f3f", save: "#108a4b", bar: "#cdd6e2" };
// local copy of lib/i18n fill(): importing that module would ship every dictionary to the browser
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (m, k: string) => (k in v ? String(v[k]) : m));
const num = (n: number) => Math.round(n).toLocaleString("en-MY");
const rm = (n: number) => "RM" + num(n);

// monotone cubic: smooth like a hand sketch, never overshoots a real value
function smooth(p: [number, number][]) {
  const n = p.length, m: number[] = [], t: number[] = [];
  for (let i = 0; i < n - 1; i++) m.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]));
  t[0] = m[0]; t[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : 2 / (1 / m[i - 1] + 1 / m[i]);
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = (p[i + 1][0] - p[i][0]) / 3;
    d += ` C${p[i][0] + h},${p[i][1] + t[i] * h} ${p[i + 1][0] - h},${p[i + 1][1] - t[i + 1] * h} ${p[i + 1][0]},${p[i + 1][1]}`;
  }
  return d;
}

let ctx: CanvasRenderingContext2D | null = null;
function textWidth(text: string) {
  if (typeof document === "undefined") return text.length * 7.5;
  ctx ??= document.createElement("canvas").getContext("2d");
  if (!ctx) return text.length * 7.5;
  ctx.font = `600 13px ${getComputedStyle(document.body).fontFamily}`;
  return ctx.measureText(text).width;
}

/** Label on a solid background, clamped inside the drawing. */
function Pill({ text, x, y, color, W, anchor = "middle" }: { text: string; x: number; y: number; color: string; W: number; anchor?: "start" | "middle" | "end" }) {
  const w = textWidth(text) + 20;
  let left = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
  left = Math.max(4, Math.min(W - w - 4, left));
  return (
    <g>
      <rect x={left} y={y - 13} width={w} height={26} rx={8} fill="var(--color-base-panel)" stroke={color} strokeWidth={1.5} />
      <text x={left + 10} y={y + 4.5} fill={color} style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600 }}>{text}</text>
    </g>
  );
}

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0); // 0 until measured: charts draw client-side only, so text measuring can't break hydration
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function Defs() {
  return (
    <defs>
      <filter id="md-glow" x="-20%" y="-200%" width="140%" height="500%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <pattern id="md-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="7" height="7" fill={C.bessSoft} />
        <rect width="2.2" height="7" fill={C.bess} />
      </pattern>
      <linearGradient id="md-fade" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor={C.save} stopOpacity={0.24} />
        <stop offset="1" stopColor={C.save} stopOpacity={0.03} />
      </linearGradient>
      <marker id="md-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill={C.bess} />
      </marker>
    </defs>
  );
}

const tick = { fill: "var(--color-base-field)", fontSize: 12, fontFamily: "var(--font-mono)" } as const;

function DayChart({ t }: { t: T }) {
  const [ref, W] = useWidth();
  const H = W < 560 ? 230 : 270, L = 44, R = 8, T0 = 56, B = 30;
  const y = (v: number) => T0 + (1 - v / YMAX) * (H - T0 - B);
  const slot = (W - L - R) / 48;
  const cx = L + DAY_MAX_I * slot + slot / 2;
  return (
    <div ref={ref} style={{ minHeight: H }}>
      {W > 0 && <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={t.ariaDay} className="overflow-visible">
        <Defs />
        {[0, 500, 1000].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--color-base-line)" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" style={tick}>{num(v)}</text>
          </g>
        ))}
        <text x={L - 8} y={y(YMAX) + 4} textAnchor="end" style={tick}>kW</text>
        {DAY.map((v, i) => (
          <rect key={i} x={L + i * slot + 1} y={y(v)} width={Math.max(1.5, slot - 2)} height={y(0) - y(v)} rx={Math.min(3, slot / 3)}
            fill={i === DAY_MAX_I ? C.md : C.bar} filter={i === DAY_MAX_I ? "url(#md-glow)" : undefined} />
        ))}
        {t.dayTicks.map((s, k) => (
          <text key={k} x={L + k * 12 * slot} y={H - 8} textAnchor={k === 0 ? "start" : k === 4 ? "end" : "middle"} style={tick}>{s}</text>
        ))}
        <line x1={cx} x2={cx} y1={y(DAY[DAY_MAX_I]) - 8} y2={34} stroke={C.md} strokeWidth={1.5} />
        <Pill text={fill(t.dayPeakLabel, { kw: num(DAY[DAY_MAX_I]) })} x={cx} y={22} color={C.md} W={W} />
      </svg>}
    </div>
  );
}

function MonthChart({ t, on, cap }: { t: T; on: boolean; cap: number }) {
  const [ref, W] = useWidth();
  const [hover, setHover] = useState<number | null>(null);
  const H = W < 560 ? 320 : 390, L = 44, R = 12, T0 = 30, B = 34;
  const x = (d: number) => L + ((d - 1) * (W - L - R)) / 29;
  const y = (v: number) => T0 + (1 - v / YMAX) * (H - T0 - B);
  const md = on ? Math.min(cap, MD0) : MD0;
  const shaved = on && md < MD0;
  const cy = y(cap), px = x(MD_DAY);
  const line = smooth(PEAK.map((v, i) => [x(i + 1), y(v)]));
  const area = `${line} L${x(30)},${y(0)} L${x(1)},${y(0)} Z`;
  const coversRight = px + 20 + textWidth(t.coversPill) + 60 < W - R;

  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const sx = ((e.clientX - box.left) * W) / box.width;
    setHover(Math.max(1, Math.min(30, Math.round((sx - L) / ((W - L - R) / 29)) + 1)));
  };
  const hv = hover ? PEAK[hover - 1] : 0;
  const hBat = hover && on ? Math.max(0, hv - cap) : 0;
  return (
    <div ref={ref} className="relative" style={{ minHeight: H }}>
      {W > 0 && <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={t.ariaMonth} className="overflow-visible">
        <Defs />
        <clipPath id="md-below"><rect x={0} y={on ? cy : 0} width={W} height={H} /></clipPath>
        <clipPath id="md-above"><rect x={0} y={0} width={W} height={on ? cy : 0} /></clipPath>
        {[0, 400, 800, 1200].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--color-base-line)" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" style={tick}>{num(v)}</text>
          </g>
        ))}
        {(W < 560 ? [1, 15, 30] : [1, 10, 20, 30]).map((d) => (
          <text key={d} x={x(d)} y={H - 10} textAnchor={d === 1 ? "start" : d === 30 ? "end" : "middle"} style={tick}>{fill(t.dayLabel, { d })}</text>
        ))}
        <path d={area} fill="url(#md-fade)" clipPath="url(#md-below)" />
        <path d={area} fill="url(#md-hatch)" clipPath="url(#md-above)" />
        <path d={line} fill="none" stroke="var(--color-base-ink)" strokeWidth={2.5} strokeLinecap="round" />
        {on && <line x1={L} x2={W - R} y1={cy} y2={cy} stroke={C.bess} strokeWidth={3} filter="url(#md-glow)" />}

        {shaved && (
          <>
            <circle cx={px} cy={y(MD0)} r={10} fill="none" stroke="var(--color-base-slate)" strokeWidth={1.5} strokeDasharray="3 3" />
            {cy - y(MD0) > 40 && <line x1={px} x2={px} y1={y(MD0) + 13} y2={cy - 16} stroke={C.bess} strokeWidth={2} markerEnd="url(#md-arrow)" />}
            <Pill text={fill(t.coversPill, { kw: num(MD0 - md) })} x={coversRight ? px + 20 : px - 20} y={(y(MD0) + cy) / 2} color={C.bess} W={W} anchor={coversRight ? "start" : "end"} />
            <text x={px} y={y(MD0) - 16} textAnchor="middle" style={{ ...tick, fill: "var(--color-base-slate)" }}>{fill(t.wasLabel, { kw: num(MD0) })}</text>
          </>
        )}
        {/* sits under the line in the first weekend dip, where the curve is far below */}
        {on && <Pill text={fill(t.batteryLinePill, { kw: num(cap) })} x={x(6.5)} y={cy + 30} color={C.bess} W={W} />}
        <circle cx={px} cy={y(md)} r={12} fill="none" stroke={C.md} strokeWidth={2.5} className={styles.ring} />
        <circle cx={px} cy={y(md)} r={4} fill={C.md} />
        <Pill text={fill(shaved ? t.newMdPill : t.mdBillsPill, { kw: num(md) })} x={px} y={shaved ? y(md) + 34 : y(md) - 30} color={C.md} W={W} />

        {hover && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={T0} y2={y(0)} stroke="var(--color-base-field)" strokeDasharray="3 4" />
            <circle cx={x(hover)} cy={y(hv)} r={5} fill="var(--color-base-ink)" stroke="var(--color-base-panel)" strokeWidth={2} />
          </>
        )}
        <rect x={L} y={T0} width={W - L - R} height={y(0) - T0} fill="transparent" onPointerMove={onMove} onPointerLeave={() => setHover(null)} />
      </svg>}
      {hover && (
        <div
          className="pointer-events-none absolute whitespace-nowrap rounded-lg bg-base-ink px-3 py-2 font-mono text-xs leading-relaxed text-white"
          style={{ left: Math.min(Math.max(x(hover), 110), W - 110), top: y(hv), transform: "translate(-50%, calc(-100% - 14px))" }}
        >
          {fill(t.tipPeak, { d: hover, kw: num(hv) })}
          <br />
          {fill(t.tipTnb, { kw: num(hv - hBat) })}
          {on && <> · {fill(t.tipBattery, { kw: num(hBat) })}</>}
        </div>
      )}
    </div>
  );
}

export default function MdChart({ t }: { t: T }) {
  const [on, setOn] = useState(true);
  const [cap, setCap] = useState(780);
  const md = on ? Math.min(cap, MD0) : MD0;
  const shaved = on && md < MD0;
  const save = (MD0 - md) * RATE;

  const card = "grid min-w-0 gap-5 rounded-[22px] border border-base-line bg-base-panel p-5 shadow-sm sm:p-7";
  const stepNum = "grid h-9 w-9 shrink-0 place-items-center rounded-full border-[1.5px] font-mono text-sm font-semibold";
  const segBtn = "rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:px-5";

  return (
    <div className="grid gap-8">
      <div className={card}>
        <div className="flex items-start gap-4">
          <span className={stepNum} style={{ borderColor: C.bess, color: C.bess }}>1</span>
          <div>
            <h3 className="text-xl font-bold leading-tight text-base-ink sm:text-2xl">{t.step1Title}</h3>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-base-slate">
              {t.step1Lead} <strong className="font-semibold text-base-ink">{t.step1Strong}</strong>{" "}
              {t.step1PricePre}<span className="whitespace-nowrap font-mono font-semibold" style={{ color: C.md }}>RM97.06</span>{t.step1PricePost}
            </p>
          </div>
        </div>
        <DayChart t={t} />
      </div>

      <div className={card}>
        <div className="flex items-start gap-4">
          <span className={stepNum} style={{ borderColor: C.bess, color: C.bess }}>2</span>
          <div>
            <h3 className="text-xl font-bold leading-tight text-base-ink sm:text-2xl">{t.step2Title}</h3>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-base-slate">
              {t.step2Lead} <strong className="font-semibold text-base-ink">{t.step2Strong}</strong> {t.step2Tail}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div role="group" aria-label={t.scenarioLabel} className="inline-flex rounded-full border border-base-line bg-base-bg p-1">
            <button type="button" aria-pressed={!on} onClick={() => setOn(false)}
              className={`${segBtn} ${!on ? "bg-base-ink text-white" : "text-base-slate"}`} style={{ outlineColor: C.bess }}>
              {t.withoutBattery}
            </button>
            <button type="button" aria-pressed={on} onClick={() => setOn(true)}
              className={`${segBtn} ${on ? "text-white shadow-md" : "text-base-slate"}`} style={{ outlineColor: C.bess, background: on ? C.bess : undefined }}>
              {t.withBattery}
            </button>
          </div>
          <div className={`flex min-w-0 flex-[1_1_260px] items-center gap-3 transition-opacity ${on ? "" : "opacity-35"}`}>
            <label htmlFor="md-cap" className="whitespace-nowrap text-sm font-semibold text-base-ink">{t.batteryLine}</label>
            <input id="md-cap" type="range" min={700} max={1000} step={10} value={cap} disabled={!on}
              onChange={(e) => setCap(+e.target.value)} className="min-w-0 flex-1" style={{ accentColor: C.bess }} />
            <output htmlFor="md-cap" className="min-w-[72px] text-right font-mono text-sm font-semibold" style={{ color: C.bess }}>{num(cap)} kW</output>
          </div>
        </div>

        <MonthChart t={t} on={on} cap={cap} />

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-base-slate">
          <span className="inline-flex items-center gap-2">
            <i className="inline-block h-3 w-5 rounded-[3px] border-[1.5px]" style={{ borderColor: C.save, background: "rgba(16,138,75,.18)" }} />{t.legendTnb}
          </span>
          <span className={`inline-flex items-center gap-2 transition-opacity ${on ? "" : "opacity-35"}`}>
            <i className="inline-block h-3 w-5 rounded-[3px]" style={{ background: `repeating-linear-gradient(135deg, ${C.bess} 0 2px, ${C.bessSoft} 2px 6px)` }} />{t.legendBattery}
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="inline-block h-3 w-3 rounded-full border-2" style={{ borderColor: C.md }} />{t.legendMd}
          </span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-x-7 gap-y-3 border-t border-base-line pt-5" aria-live="polite">
          <div>
            <p className="font-mono text-[clamp(38px,8vw,60px)] font-bold leading-none tracking-tight tabular-nums" style={{ color: shaved ? C.save : C.md }}>
              {rm(shaved ? save : MD0 * RATE)}
            </p>
            <p className="mt-2 text-sm text-base-slate">{shaved ? t.savedMonthly : t.chargeMonthly}</p>
          </div>
          <div className="grid gap-1.5 font-mono text-sm text-base-slate tabular-nums">
            {shaved ? (
              <>
                <p>{t.factMd} <b className="font-semibold text-base-ink">{num(MD0)} → {num(md)} kW</b></p>
                <p>{t.factBill} <b className="font-semibold text-base-ink">{rm(MD0 * RATE)} → {rm(md * RATE)}</b></p>
                <p>{t.factYear} <b className="font-semibold text-base-ink">{rm(save * 12)}</b></p>
              </>
            ) : (
              <>
                <p>{t.factMd} <b className="font-semibold text-base-ink">{num(MD0)} kW</b> × <b className="font-semibold text-base-ink">RM{RATE}</b></p>
                <p>{fill(t.factOnePeak, { d: MD_DAY })}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="max-w-3xl text-xs leading-relaxed text-base-slate">{t.foot}</p>
    </div>
  );
}
