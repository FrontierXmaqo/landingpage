"use client";

import { useState } from "react";
import { MILESTONES } from "./milestones";

export type PageStats = {
  page: string;
  views: number;
  avgScrollDepth: number;
  milestoneReach: Record<(typeof MILESTONES)[number], number>; // % of views that scrolled at least this far
  avgActiveSeconds: number;
  topSections: { id: string; avgSeconds: number }[];
  formDropoff: { field: string; count: number }[]; // last field touched before leaving, most common first
};

export type PageGroup = {
  page: string;
  /** One entry per site language, always all of them, so a language with no visits still gets its own tab. */
  locales: { locale: string; label: string; stats: PageStats }[];
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

function formatSeconds(s: number) {
  if (s < 60) return `${Math.round(s)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

/** The stats body for whichever language tab is currently selected. */
function PageStatsBody({ stats }: { stats: PageStats }) {
  if (stats.views === 0) return <p className="mt-4 text-xs text-base-slate">No visits yet.</p>;

  return (
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
  );
}

/**
 * One page category, with a language tab per site locale. Switching tabs is
 * local state — the data for all three languages is already on the page, so
 * there's nothing to refetch.
 */
function PageSection({ group }: { group: PageGroup }) {
  const [locale, setLocale] = useState(group.locales[0].locale);
  const active = group.locales.find((l) => l.locale === locale) ?? group.locales[0];
  const empty = active.stats.views === 0;

  return (
    <div
      className={
        empty
          ? "rounded-xl border border-dashed border-base-line p-5"
          : "rounded-xl border border-base-line bg-base-panel p-5"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-semibold ${empty ? "text-base-slate" : "text-base-ink"}`}>{group.page}</p>
        <div className="flex shrink-0 gap-1 rounded-full border border-base-line bg-base-bg p-1">
          {group.locales.map((l) => (
            <button
              key={l.locale}
              type="button"
              onClick={() => setLocale(l.locale)}
              aria-current={l.locale === locale ? "true" : undefined}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                l.locale === locale ? "bg-base-panel text-base-ink shadow-sm" : "text-base-slate hover:text-base-ink"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs tabular-nums text-base-slate">{active.stats.views.toLocaleString("en-MY")} views</p>

      <PageStatsBody stats={active.stats} />
    </div>
  );
}

export default function PagePerformance({ groups }: { groups: PageGroup[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-base-ink">Page performance</p>
      <p className="mt-1 text-xs text-base-slate">
        Scroll depth, attention and form drop-off, per page. Pick a language tab on any card to see that version.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <PageSection key={g.page} group={g} />
        ))}
      </div>
    </div>
  );
}
