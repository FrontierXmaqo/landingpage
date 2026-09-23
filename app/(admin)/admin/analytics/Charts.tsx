"use client";

/**
 * The analytics dashboard's presentation layer. Everything here is already
 * aggregated — the page hands down summaries, never rows — so this component
 * only decides how numbers look, not what they are.
 *
 * Horizontal bars rather than a chart library: every breakdown here is a short
 * ranked list with long labels ("Bandar Baru Bangi", "Negeri Sembilan"), which
 * a vertical axis mangles and a plain bar reads perfectly.
 */

import { useRef, useState, type PointerEvent } from "react";

export type Bucket = { label: string; value: number; sub?: string };

export type Overview = {
  sessions: number;
  pageviews: number;
  new_sessions: number;
  pages_per_session: number;
  avg_scroll: number;
  avg_active_ms: number;
  avg_total_ms: number;
  scroll: { depth: number; reached: number }[];
  pages: { path: string; segment: string; views: number; avg_scroll: number }[];
};

const n0 = (v: number) => Math.round(v).toLocaleString("en-MY");

function duration(ms: number) {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
}

/* ---------------- primitives ---------------- */

function Tile({ label, value, sub, children }: { label: string; value: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="admin-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-base-slate">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums text-base-ink">{value}</p>
      {sub && <p className="mt-0.5 text-xs tabular-nums text-base-slate">{sub}</p>}
      {children}
    </div>
  );
}

function Bars({ title, rows, colour, action, empty }: { title: string; rows: Bucket[]; colour: string; action?: React.ReactNode; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="admin-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-base-ink">{title}</h3>
        {action}
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-base-slate">{empty ?? "Nothing in this period yet."}</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[6.5rem_1fr_2rem] items-center gap-2">
              <span className="text-xs text-base-slate">
                {r.label}
                {r.sub && <span className="block text-[11px] tabular-nums text-status-inactive">{r.sub}</span>}
              </span>
              <span className="h-4 overflow-hidden rounded bg-base-bg">
                <span className="block h-full rounded-r" style={{ width: `${(r.value / max) * 100}%`, backgroundColor: colour }} />
              </span>
              <span className="text-right text-xs font-semibold tabular-nums text-base-ink">{r.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- sections ---------------- */

type ScrollRow = { depth: number; reached: number; pct: number; drop: number };

/** Drop-off reads off the previous row rather than a running variable, so
 *  the render stays pure. Shared by the chart and the table so they never
 *  disagree. */
function computeScrollRows(scroll: Overview["scroll"], sessions: number): ScrollRow[] {
  const pcts = scroll.map((s) => (s.reached / sessions) * 100);
  return scroll.map(({ depth, reached }, i) => {
    const previous = i === 0 ? null : pcts[i - 1];
    return {
      depth,
      reached,
      pct: pcts[i],
      drop: previous === null || previous === 0 ? 0 : ((previous - pcts[i]) / previous) * 100,
    };
  });
}

const SCROLL_CHART_W = 640;
const SCROLL_CHART_H = 220;
const SCROLL_PAD = { l: 30, r: 8, t: 26, b: 22 };

/** Bar chart of the same rows the table lists — one bar per 5%-depth bucket,
 *  height is % of sessions that reached it. Bars that fell 15%+ from the
 *  previous bucket (the table's own threshold for colouring a row) get the
 *  critical colour and a paired label, never colour alone. */
function ScrollDepthChart({ rows }: { rows: ScrollRow[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ i: number; xPct: number; yPct: number } | null>(null);

  const plotW = SCROLL_CHART_W - SCROLL_PAD.l - SCROLL_PAD.r;
  const plotH = SCROLL_CHART_H - SCROLL_PAD.t - SCROLL_PAD.b;
  const baseline = SCROLL_PAD.t + plotH;
  const slot = plotW / rows.length;
  const barW = Math.min(20, slot - 6);
  const yFor = (pct: number) => SCROLL_PAD.t + plotH * (1 - pct / 100);

  const worstIdx = rows.reduce((best, r, i) => (r.drop > rows[best].drop ? i : best), 0);
  const hovered = hover ? rows[hover.i] : null;
  const previous = hover && hover.i > 0 ? rows[hover.i - 1] : null;

  function showFromPointer(e: PointerEvent<SVGRectElement>, i: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ i, xPct: ((e.clientX - rect.left) / rect.width) * 100, yPct: ((e.clientY - rect.top) / rect.height) * 100 });
  }
  function showFromFocus(i: number, cx: number, y: number) {
    setHover({ i, xPct: (cx / SCROLL_CHART_W) * 100, yPct: (y / SCROLL_CHART_H) * 100 });
  }

  return (
    <div>
      <div ref={wrapRef} className="relative">
        <svg
          viewBox={`0 0 ${SCROLL_CHART_W} ${SCROLL_CHART_H}`}
          className="block h-auto w-full overflow-visible"
          role="img"
          aria-label="Percent of sessions reaching each scroll depth, 5 to 100 percent"
        >
          {[0, 25, 50, 75, 100].map((t) => {
            const y = yFor(t);
            return (
              <g key={t}>
                <line x1={SCROLL_PAD.l} x2={SCROLL_CHART_W - SCROLL_PAD.r} y1={y} y2={y} stroke="var(--color-base-line)" strokeWidth={1} />
                <text x={SCROLL_PAD.l - 6} y={y + 3} textAnchor="end" fontSize={9.5} fill="var(--color-base-slate)" className="tabular-nums">
                  {t}%
                </text>
              </g>
            );
          })}
          {rows.map((r, i) => {
            const cx = SCROLL_PAD.l + slot * i + slot / 2;
            const y = yFor(r.pct);
            const flagged = r.drop >= 15;
            const color = flagged ? "var(--color-status-critical)" : "var(--color-chart-1)";
            const barH = Math.max(0, baseline - y);
            const isEndpoint = i === 0 || i === rows.length - 1;
            return (
              <g key={r.depth}>
                <rect x={cx - barW / 2} y={y} width={barW} height={barH} rx={4} fill={color} />
                {barH > 4 && <rect x={cx - barW / 2} y={baseline - 4} width={barW} height={4} fill={color} />}
                {isEndpoint && (
                  <text x={cx} y={y - 8} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-base-ink)" className="tabular-nums">
                    {r.pct.toFixed(1)}%
                  </text>
                )}
                {flagged && !isEndpoint && (
                  <text x={cx} y={y - 8} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--color-status-critical)">
                    ▼{r.drop.toFixed(0)}%
                  </text>
                )}
                {(r.depth % 20 === 0 || i === 0) && (
                  <text x={cx} y={baseline + 14} textAnchor="middle" fontSize={9.5} fill="var(--color-base-slate)" className="tabular-nums">
                    {r.depth}%
                  </text>
                )}
                <rect
                  x={SCROLL_PAD.l + slot * i}
                  y={SCROLL_PAD.t}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  role="img"
                  aria-label={`${r.depth}% scrolled: ${n0(r.reached)} visitors, ${r.pct.toFixed(1)}% of sessions${i === 0 ? "" : `, ${r.drop.toFixed(1)}% drop from the previous step`}`}
                  className="cursor-pointer outline-none"
                  onPointerEnter={(e) => showFromPointer(e, i)}
                  onPointerMove={(e) => showFromPointer(e, i)}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => showFromFocus(i, cx, y)}
                  onBlur={() => setHover(null)}
                />
              </g>
            );
          })}
        </svg>

        {hovered && hover && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg bg-base-ink px-2.5 py-2 text-xs leading-snug text-white shadow-lg"
            style={{ left: `${hover.xPct}%`, top: `${hover.yPct}%`, transform: "translate(-50%, calc(-100% - 10px))" }}
          >
            <div className="font-semibold tabular-nums">{n0(hovered.reached)} visitors</div>
            <div className="text-white/60">
              reached {hovered.depth}% scroll · {hovered.pct.toFixed(1)}%
            </div>
            {previous && (
              <div className={hovered.drop >= 15 ? "text-red-300" : "text-white/60"}>
                {hovered.drop >= 15 ? "▼ " : ""}
                {hovered.drop.toFixed(1)}% drop vs {previous.depth}%
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-base-slate">
        <span aria-hidden className="h-2 w-2 rounded-sm" style={{ backgroundColor: "var(--color-status-critical)" }} />
        Bar dropped 15%+ from the previous step
      </div>

      {rows[worstIdx].drop > 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-status-critical/40 bg-status-critical/5 px-3 py-2 text-xs text-base-ink">
          <span className="text-status-critical">▼</span>
          <span>
            Steepest drop:{" "}
            <b className="tabular-nums">
              {rows[worstIdx - 1].depth}% → {rows[worstIdx].depth}% scroll
            </b>
            , <b className="tabular-nums text-status-critical">-{rows[worstIdx].drop.toFixed(1)}%</b> of visitors (
            {n0(rows[worstIdx - 1].reached)} → {n0(rows[worstIdx].reached)})
          </span>
        </div>
      )}
    </div>
  );
}

function ScrollDepth({ scroll, sessions }: { scroll: Overview["scroll"]; sessions: number }) {
  const [view, setView] = useState<"chart" | "table">("chart");

  if (!sessions) {
    return (
      <div className="admin-card p-5">
        <h3 className="text-sm font-semibold text-base-ink">Scroll depth</h3>
        <p className="mt-2 text-xs text-base-slate">No page views recorded in this period yet.</p>
      </div>
    );
  }

  const rows = computeScrollRows(scroll, sessions);

  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-base-line px-5 py-3.5">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-base-ink">Scroll depth</h3>
          <span className="text-xs text-base-slate">Where visitors stop</span>
        </div>
        <div className="flex w-fit gap-1 rounded-full border border-base-line bg-base-bg p-1">
          {(["chart", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                view === v ? "bg-base-panel text-base-ink shadow-sm" : "text-base-slate hover:text-base-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "chart" ? (
        <div className="p-5">
          <ScrollDepthChart rows={rows} />
        </div>
      ) : (
        <div className="max-h-[26rem] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-base-panel">
              <tr className="border-b border-base-line text-[11px] uppercase tracking-wide text-base-slate">
                <th scope="col" className="px-5 py-2 text-left font-semibold">% scrolled</th>
                <th scope="col" className="px-5 py-2 text-right font-semibold"># visitors</th>
                <th scope="col" className="px-5 py-2 text-right font-semibold">% drop off</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.depth} className="border-b border-base-line last:border-0">
                  <td className="px-5 py-2 tabular-nums">{r.depth}%</td>
                  <td className="px-5 py-2 text-right tabular-nums">
                    {n0(r.reached)} <span className="text-base-slate">({r.pct.toFixed(1)}%)</span>
                  </td>
                  {/* Only a steep fall is worth colouring; marking every row
                      would make the colour mean nothing. */}
                  <td className={`px-5 py-2 text-right tabular-nums ${r.drop >= 15 ? "font-semibold text-status-critical" : "text-base-slate"}`}>
                    {r.drop.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TopPages({ pages }: { pages: Overview["pages"] }) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-base-line px-5 py-3.5">
        <h3 className="text-sm font-semibold text-base-ink">Pages</h3>
        <span className="text-xs text-base-slate">By page views</span>
      </div>
      {pages.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-base-slate">No page views recorded in this period yet.</p>
      ) : (
        <div className="max-h-[26rem] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-base-panel">
              <tr className="border-b border-base-line text-[11px] uppercase tracking-wide text-base-slate">
                <th scope="col" className="px-5 py-2 text-left font-semibold">Page</th>
                <th scope="col" className="px-5 py-2 text-right font-semibold">Views</th>
                <th scope="col" className="px-5 py-2 text-right font-semibold">Avg scroll</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.path} className="border-b border-base-line last:border-0">
                  <td className="px-5 py-2 font-medium">{p.path}</td>
                  <td className="px-5 py-2 text-right tabular-nums">{n0(p.views)}</td>
                  <td className="px-5 py-2 text-right tabular-nums text-base-slate">{Number(p.avg_scroll).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- the page body ---------------- */

export default function Charts({
  overview,
  funnel,
  leads,
  leadsCaption,
}: {
  overview: Overview;
  funnel: { visitors: number; calculatorUsers: number; enquiries: number; enquiryConversion: number; calculatorCompletion: number };
  leads: {
    total: number;
    byStatus: Bucket[];
    bySource: Bucket[];
    byState: Bucket[];
    unknownSegment: number;
  };
  leadsCaption: string;
}) {
  const o = overview;
  const returning = o.sessions - o.new_sessions;

  return (
    <div className="mt-8 space-y-8">
      {/* --- visitor behaviour --- */}
      <section>
        <h2 className="text-sm font-semibold text-base-ink">Visitor behaviour</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <Tile label="Sessions" value={n0(o.sessions)} sub={`${n0(o.pageviews)} page views`} />
          <Tile
            label="New visitors"
            value={o.sessions ? `${((o.new_sessions / o.sessions) * 100).toFixed(1)}%` : "-"}
            sub={`${n0(o.new_sessions)} new · ${n0(returning)} returning`}
          >
            <div className="mt-2.5 flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-base-line">
              <span className="block h-full bg-chart-1" style={{ width: `${o.sessions ? (o.new_sessions / o.sessions) * 100 : 0}%` }} />
              <span className="block h-full bg-chart-5" style={{ width: `${o.sessions ? (returning / o.sessions) * 100 : 0}%` }} />
            </div>
          </Tile>
          <Tile label="Pages per session" value={Number(o.pages_per_session).toFixed(2)} sub="average for this period" />
          <Tile label="Avg scroll depth" value={`${Number(o.avg_scroll).toFixed(1)}%`} sub="of page height reached" />
          <Tile label="Active time spent" value={duration(o.avg_active_ms)} sub={`out of ${duration(o.avg_total_ms)} total`} />
          <Tile
            label="Enquiry conversion"
            value={`${funnel.enquiryConversion.toFixed(2)}%`}
            sub={`${n0(funnel.enquiries)} enquiries from ${n0(funnel.visitors)} visitors`}
          />
        </div>
      </section>

      {/* --- where they stop, and on what --- */}
      <section className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <ScrollDepth scroll={o.scroll} sessions={o.pageviews} />
        <TopPages pages={o.pages} />
      </section>

      {/* --- calculator funnel, unchanged in substance --- */}
      <section>
        <h2 className="text-sm font-semibold text-base-ink">Calculator funnel</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Tile label="Calculator users" value={n0(funnel.calculatorUsers)} sub="started the savings calculator" />
          <Tile label="Calculator completion" value={`${funnel.calculatorCompletion.toFixed(1)}%`} sub="completions ÷ users" />
          <Tile label="Submitted enquiries" value={n0(funnel.enquiries)} sub={leadsCaption} />
        </div>
      </section>

      {/* --- leads --- */}
      <section>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-base-ink">Leads</h2>
          <p className="text-xs tabular-nums text-base-slate">
            {leads.total} leads · {leadsCaption}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-3">
          <Bars title="Leads by status" rows={leads.byStatus} colour="var(--color-chart-1)" />
          <Bars title="Leads by state" rows={leads.byState} colour="var(--color-chart-5)" />
          <Bars title="Leads by source" rows={leads.bySource} colour="var(--color-chart-3)" />
        </div>

        {leads.unknownSegment > 0 && (
          <p className="mt-3 text-xs text-base-slate">
            {leads.unknownSegment} older leads can&rsquo;t be split into Residential or EV: the two shared one table with
            nothing recording which form they came from.
          </p>
        )}
      </section>
    </div>
  );
}
