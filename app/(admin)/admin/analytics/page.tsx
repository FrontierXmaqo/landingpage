import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile, type Role } from "@/lib/supabase/server";
import { SEGMENTS, SEGMENT_LABEL, type Segment } from "@/lib/segments";
import { leadLocation } from "@/lib/postcode";
import Charts, { type Bucket, type Overview } from "./Charts";
import FilterBar from "./FilterBar";
import { parseFilters, rangeLabel, sinceISO } from "./filters";

/** Grouped tallies from lead_overview — counts only, never a lead's details. */
type LeadGroup = {
  segment: string;
  status: string | null;
  source: string | null;
  state: string | null;
  postcode: string | null;
  n: number;
};

const EMPTY_OVERVIEW: Overview = {
  sessions: 0, pageviews: 0, new_sessions: 0, pages_per_session: 0,
  avg_scroll: 0, avg_active_ms: 0, avg_total_ms: 0,
  rage: 0, dead: 0, excess: 0, quick_back: 0, scroll: [], pages: [],
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

  const [overviewRes, leadsRes, eventsRes] = await Promise.all([
    // Both aggregate in Postgres: the page receives summaries, never rows.
    supabase.rpc("analytics_overview", {
      p_since: since,
      p_segments: segments,
      p_device: filters.device === "all" ? null : filters.device,
      p_path: filters.path,
    }),
    supabase.rpc("lead_overview", { p_since: since, p_segments: segments }),
    supabase.from("analytics_events").select("event_type, session_id").gte("created_at", since),
  ]);

  const overview: Overview = { ...EMPTY_OVERVIEW, ...((overviewRes.data as Overview | null) ?? {}) };
  const leadData = (leadsRes.data as { total: number; rows: LeadGroup[]; unknown_segment: number } | null) ?? {
    total: 0,
    rows: [],
    unknown_segment: 0,
  };
  const groups = leadData.rows ?? [];

  /* Location: the postcode where there is one, the state dropdown where there
     isn't — leadLocation applies that preference per lead. */
  const byState: Bucket[] = tally(
    groups.map((g) => ({ ...g, state: leadLocation(g).state })),
    (g) => g.state,
  ).slice(0, 6);

  const districts = new Map<string, { value: number; towns: Map<string, string> }>();
  for (const g of groups) {
    const loc = leadLocation(g);
    if (loc.state !== "Selangor" || !loc.district) continue;
    const entry = districts.get(loc.district) ?? { value: 0, towns: new Map() };
    entry.value += g.n;
    if (loc.town && g.postcode) entry.towns.set(loc.town, g.postcode);
    districts.set(loc.district, entry);
  }
  const selangor: Bucket[] = [...districts.entries()]
    .sort((a, b) => b[1].value - a[1].value)
    .map(([label, { value, towns }]) => {
      const [top] = [...towns.entries()];
      const extra = towns.size - 1;
      return { label, value, sub: top ? `${top[0]} ${top[1]}${extra > 0 ? ` +${extra}` : ""}` : undefined };
    });

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
          selangor,
          missingPostcode: groups.filter((g) => !g.postcode).reduce((t, g) => t + g.n, 0),
          unknownSegment: leadData.unknown_segment ?? 0,
        }}
        leadsCaption={scope}
      />
    </div>
  );
}
