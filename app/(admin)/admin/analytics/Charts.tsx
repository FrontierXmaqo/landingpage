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

function ScrollDepth({ scroll, sessions }: { scroll: Overview["scroll"]; sessions: number }) {
  if (!sessions) {
    return (
      <div className="admin-card p-5">
        <h3 className="text-sm font-semibold text-base-ink">Scroll depth</h3>
        <p className="mt-2 text-xs text-base-slate">No page views recorded in this period yet.</p>
      </div>
    );
  }

  // Drop-off reads off the previous row rather than a running variable, so
  // the render stays pure.
  const pcts = scroll.map((s) => (s.reached / sessions) * 100);
  const rows = scroll.map(({ depth, reached }, i) => {
    const previous = i === 0 ? null : pcts[i - 1];
    return {
      depth,
      reached,
      pct: pcts[i],
      drop: previous === null || previous === 0 ? 0 : ((previous - pcts[i]) / previous) * 100,
    };
  });

  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-base-line px-5 py-3.5">
        <h3 className="text-sm font-semibold text-base-ink">Scroll depth</h3>
        <span className="text-xs text-base-slate">Where visitors stop</span>
      </div>
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
            value={o.sessions ? `${((o.new_sessions / o.sessions) * 100).toFixed(1)}%` : "—"}
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
