const MILESTONES = [25, 50, 75, 100] as const;

export type LocaleGroup = {
  locale: string;
  /** The language's own name, as the public site's switcher writes it. */
  label: string;
  views: number;
  pages: PageStats[];
};

export type PageStats = {
  page: string;
  views: number;
  avgScrollDepth: number;
  milestoneReach: Record<(typeof MILESTONES)[number], number>; // % of views that scrolled at least this far
  avgActiveSeconds: number;
  topSections: { id: string; avgSeconds: number }[];
  formDropoff: { field: string; count: number }[]; // last field touched before leaving, most common first
};

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-base-bg">
      <div className="h-full rounded-full" style={{ width: `${Math.max(2, pct)}%`, background: color }} />
    </div>
  );
}

function ScrollFunnel({ milestoneReach }: { milestoneReach: PageStats["milestoneReach"] }) {
  return (
    <div className="space-y-1.5">
      {MILESTONES.map((m) => (
        <div key={m} className="flex items-center gap-2">
          <span className="w-9 shrink-0 text-[11px] font-medium text-base-slate">{m}%</span>
          <Bar pct={milestoneReach[m]} color="var(--color-chart-1)" />
          <span className="w-10 shrink-0 text-right text-[11px] text-base-slate">{milestoneReach[m].toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}

/**
 * An un-visited page keeps its place in the grid but recedes: dashed border,
 * no panel fill, so the eye skips it and lands on the pages with real traffic
 * without the layout shifting between visits.
 */
function PageCard({ stats }: { stats: PageStats }) {
  const empty = stats.views === 0;
  return (
    <div
      className={
        empty
          ? "rounded-xl border border-dashed border-base-line p-5"
          : "rounded-xl border border-base-line bg-base-panel p-5"
      }
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className={`text-sm font-semibold ${empty ? "text-base-slate" : "text-base-ink"}`}>{stats.page}</p>
        <p className="shrink-0 text-xs tabular-nums text-base-slate">
          {stats.views.toLocaleString("en-MY")} views
        </p>
      </div>

      {empty ? (
        <p className="mt-3 text-xs text-base-slate">No visits yet.</p>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">Scroll depth reached</p>
            <div className="mt-2">
              <ScrollFunnel milestoneReach={stats.milestoneReach} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-base-line pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">Avg. time on page</p>
            <p className="text-sm font-bold text-base-ink">{formatSeconds(stats.avgActiveSeconds)}</p>
          </div>

          {stats.topSections.length > 0 && (
            <div className="border-t border-base-line pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">Sections that hold attention</p>
              <div className="mt-2 space-y-1.5">
                {stats.topSections.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="text-base-ink">{s.id}</span>
                    <span className="font-semibold text-base-slate">{formatSeconds(s.avgSeconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.formDropoff.length > 0 && (
            <div className="border-t border-base-line pt-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">Where the form loses people</p>
              <div className="mt-2 space-y-1.5">
                {stats.formDropoff.map((f) => (
                  <div key={f.field} className="flex items-center justify-between text-xs">
                    <span className="text-base-ink">{f.field}</span>
                    <span className="font-semibold text-base-slate">{f.count}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-base-slate">Last field touched before visitors left without submitting.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatSeconds(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

/**
 * One language, with its pages in fixed site order. The heading carries the
 * language's total so the three groups can be compared at a glance without
 * adding up cards.
 */
function LocaleSection({ group }: { group: LocaleGroup }) {
  return (
    <section>
      <div className="flex items-baseline gap-2 border-b border-base-line pb-2">
        <h3 className="text-sm font-semibold text-base-ink">{group.label}</h3>
        <code className="rounded bg-base-bg px-1.5 py-0.5 text-[11px] font-medium text-base-slate">
          /{group.locale}
        </code>
        <span className="ml-auto shrink-0 text-xs tabular-nums text-base-slate">
          {group.views.toLocaleString("en-MY")} views
        </span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {group.pages.map((p) => (
          <PageCard key={p.page} stats={p} />
        ))}
      </div>
    </section>
  );
}

export default function PagePerformance({ groups }: { groups: LocaleGroup[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-base-ink">Page performance</p>
      <p className="mt-1 text-xs text-base-slate">
        Scroll depth, attention and form drop-off, per page and per language. Same order every time, so the
        three languages line up for comparison.
      </p>
      <div className="mt-4 space-y-7">
        {groups.map((g) => (
          <LocaleSection key={g.locale} group={g} />
        ))}
      </div>
    </div>
  );
}
