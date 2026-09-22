import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile, type Role } from "@/lib/supabase/server";
import { SEGMENTS, SEGMENT_LABEL, type Segment } from "@/lib/segments";
import Charts, { type Bucket, type Overview } from "./Charts";
import FilterBar from "./FilterBar";
import { parseFilters, rangeLabel, sinceISO } from "./filters";
import PagePerformance, { type PageStats } from "./PagePerformance";
import { startOfMonthMYISO } from "@/lib/datetime";
import { pageNameFromPath, PAGES_WITH_FORM } from "@/lib/pageNames";

const MILESTONES = [25, 50, 75, 100] as const;

type PageviewRow = {
  path: string;
  scroll_depth: number | null;
  active_ms: number | null;
  section_dwell: Record<string, number> | null;
  form_started: boolean | null;
  form_last_field: string | null;
};

function buildPageStats(rows: PageviewRow[]): PageStats[] {
  const byPage = new Map<string, PageviewRow[]>();
  for (const row of rows) {
    const page = pageNameFromPath(row.path);
    if (!byPage.has(page)) byPage.set(page, []);
    byPage.get(page)!.push(row);
  }

  return [...byPage.entries()]
    .map(([page, views]) => {
      const n = views.length;
      const avg = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

      const milestoneReach = Object.fromEntries(
        MILESTONES.map((m) => [m, n ? (views.filter((v) => (v.scroll_depth ?? 0) >= m).length / n) * 100 : 0])
      ) as PageStats["milestoneReach"];

      const sectionTotals = new Map<string, { sumMs: number; count: number }>();
      for (const v of views) {
        for (const [id, ms] of Object.entries(v.section_dwell ?? {})) {
          const entry = sectionTotals.get(id) ?? { sumMs: 0, count: 0 };
          entry.sumMs += ms;
          entry.count += 1;
          sectionTotals.set(id, entry);
        }
      }
      const topSections = [...sectionTotals.entries()]
        .map(([id, { sumMs, count }]) => ({ id, avgSeconds: sumMs / count / 1000 }))
        .sort((a, b) => b.avgSeconds - a.avgSeconds)
        .slice(0, 3);

      const dropoffCounts = new Map<string, number>();
      if (PAGES_WITH_FORM.has(page)) {
        for (const v of views) {
          if (!v.form_started || !v.form_last_field) continue;
          dropoffCounts.set(v.form_last_field, (dropoffCounts.get(v.form_last_field) ?? 0) + 1);
        }
      }
      const formDropoff = [...dropoffCounts.entries()]
        .map(([field, count]) => ({ field, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        page,
        views: n,
        avgScrollDepth: avg(views.map((v) => v.scroll_depth ?? 0)),
        milestoneReach,
        avgActiveSeconds: avg(views.map((v) => v.active_ms ?? 0)) / 1000,
        topSections,
        formDropoff,
      };
    })
    .sort((a, b) => b.views - a.views);
}

/** Grouped tallies from lead_overview — counts only, never a lead's details. */
type LeadGroup = {
  segment: string;
  status: string | null;
  source: string | null;
  state: string | null;
  n: number;
};

const EMPTY_OVERVIEW: Overview = {
  sessions: 0, pageviews: 0, new_sessions: 0, pages_per_session: 0,
  avg_scroll: 0, avg_active_ms: 0, avg_total_ms: 0,
  scroll: [], pages: [],
};

const STATUS_ORDER = ["new", "contacted", "qualified", "converted"];
const SOURCE_ORDER = ["google", "social", "direct"];
const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * What this role is allowed to see. Mirrors the Enquiries page: sales_resi
 * covers Residential and EV, sales_ci covers C&I, admin and marketing see
 * everything. The database enforces it too — lead_overview derives its own
 * scope from the caller's role rather than trusting anything sent here.
 */
function allowedSegments(role: Role): Segment[] {
  if (role === "sales_resi") return ["residential", "ev"];
  if (role === "sales_ci") return ["ci"];
  return ["residential", "ci", "ev"];
}

/** Sums grouped rows into ranked buckets. */
function tally(rows: LeadGroup[], pick: (r: LeadGroup) => string | null, order?: string[]): Bucket[] {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const key = pick(row);
    if (key) counts.set(key, (counts.get(key) ?? 0) + row.n);
  }
  if (order) {
    return order.filter((k) => counts.has(k)).map((k) => ({ label: title(k), value: counts.get(k)! }));
  }
  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default async function AnalyticsPage({ searchParams }: PageProps<"/admin/analytics">) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");
  if (!["admin", "marketing", "sales_resi", "sales_ci"].includes(profile.role)) redirect("/admin");

  const allowed = allowedSegments(profile.role);
  const filters = parseFilters(await searchParams, allowed);
  const since = sinceISO(filters.range);

  // "All" means everything this role may see, never everything there is.
  const segments = filters.segment === "all" ? allowed : [filters.segment];
  const supabase = await getSupabaseUserClient();

  const [overviewRes, leadsRes, eventsRes, pageviewsRes] = await Promise.all([
    // Both aggregate in Postgres: the page receives summaries, never rows.
    supabase.rpc("analytics_overview", {
      p_since: since,
      p_segments: segments,
      p_device: filters.device === "all" ? null : filters.device,
      p_path: filters.path,
    }),
    supabase.rpc("lead_overview", { p_since: since, p_segments: segments }),
    supabase.from("analytics_events").select("event_type, session_id").gte("created_at", since),
    supabase
      .from("analytics_pageviews")
      .select("path, scroll_depth, active_ms, section_dwell, form_started, form_last_field")
      .gte("created_at", since),
  ]);

  const overview: Overview = { ...EMPTY_OVERVIEW, ...((overviewRes.data as Overview | null) ?? {}) };
  const leadData = (leadsRes.data as { total: number; rows: LeadGroup[]; unknown_segment: number } | null) ?? {
    total: 0,
    rows: [],
    unknown_segment: 0,
  };
  const groups = leadData.rows ?? [];
  const pageStats = buildPageStats(pageviewsRes.data ?? []);

  /* Location comes from the state dropdown on the form. */
  const byState: Bucket[] = tally(groups, (g) => g.state).slice(0, 6);

  /* The original calculator funnel, still from analytics_events. */
  const events = eventsRes.data ?? [];
  const distinct = (type: string) => new Set(events.filter((e) => e.event_type === type).map((e) => e.session_id)).size;
  const visitors = distinct("pageview");
  const calculatorUsers = distinct("calculator_start");
  const calculatorCompletions = distinct("calculator_complete");
  const enquiries = leadData.total;

  const segmentName = filters.segment === "all" ? (allowed.length === 1 ? SEGMENT_LABEL[allowed[0]] : "All segments") : SEGMENT_LABEL[filters.segment];
  const scope = [segmentName, rangeLabel(filters.range).toLowerCase(), filters.device === "all" ? null : filters.device, filters.path]
    .filter(Boolean)
    .join(" · ");

  // Only pages that actually have traffic, so the filter has no dead options.
  const paths = overview.pages.map((p) => p.path).slice(0, 8);

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-ink">Performance Analytics</h1>
      <p className="mt-1 text-sm text-base-slate">
        Visitor behaviour and lead performance, tracked first-party from the public site.
      </p>

      <FilterBar filters={filters} paths={paths} segments={SEGMENTS.filter((s) => allowed.includes(s.id))} />

      <p className="mt-3 text-xs tabular-nums text-base-slate">
        {overview.sessions.toLocaleString("en-MY")} sessions · {scope}
      </p>

      <Charts
        overview={overview}
        funnel={{
          visitors,
          calculatorUsers,
          enquiries,
          enquiryConversion: visitors ? (enquiries / visitors) * 100 : 0,
          calculatorCompletion: calculatorUsers ? (calculatorCompletions / calculatorUsers) * 100 : 0,
        }}
        leads={{
          total: leadData.total,
          byStatus: tally(groups, (g) => g.status?.toLowerCase() ?? null, STATUS_ORDER),
          bySource: tally(groups, (g) => (g.source || "direct").toLowerCase(), SOURCE_ORDER),
          byState,
          unknownSegment: leadData.unknown_segment ?? 0,
        }}
        leadsCaption={scope}
      />

      <div className="mt-6">
        <PagePerformance pages={pageStats} />
      </div>
    </div>
  );
}
