import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import Charts from "./Charts";
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

export default async function AnalyticsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  const since = startOfMonthMYISO();
  const supabase = await getSupabaseUserClient();

  const [{ data: events }, { data: leads }, { data: pageviews }] = await Promise.all([
    supabase.from("analytics_events").select("event_type, session_id").gte("created_at", since),
    supabase.from("atap_leads").select("status, lead_source, state").gte("created_at", since),
    supabase
      .from("analytics_pageviews")
      .select("path, scroll_depth, active_ms, section_dwell, form_started, form_last_field")
      .gte("created_at", since),
  ]);

  const pageStats = buildPageStats(pageviews ?? []);

  const distinctSessions = (type: string) => new Set((events ?? []).filter((e) => e.event_type === type).map((e) => e.session_id)).size;
  const visitors = distinctSessions("pageview");
  const calculatorUsers = distinctSessions("calculator_start");
  const calculatorCompletions = distinctSessions("calculator_complete");
  const enquiries = leads?.length ?? 0;

  const enquiryConversion = visitors ? (enquiries / visitors) * 100 : 0;
  const calculatorCompletion = calculatorUsers ? (calculatorCompletions / calculatorUsers) * 100 : 0;

  const byStatus = ["new", "contacted", "qualified", "converted"].map((status) => ({
    label: status[0].toUpperCase() + status.slice(1),
    value: (leads ?? []).filter((l) => l.status === status).length,
  }));

  const stateCounts = new Map<string, number>();
  (leads ?? []).forEach((l) => { const s = l.state || "Unknown"; stateCounts.set(s, (stateCounts.get(s) ?? 0) + 1); });
  const byLocation = [...stateCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value }));

  const bySource = ["google", "social", "direct"].map((source) => ({
    label: source[0].toUpperCase() + source.slice(1),
    value: (leads ?? []).filter((l) => (l.lead_source || "direct") === source).length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-ink">Performance Analytics</h1>
      <p className="mt-1 text-sm text-base-slate">This month, tracked directly from the public site.</p>

      <Charts
        visitors={visitors}
        calculatorUsers={calculatorUsers}
        enquiries={enquiries}
        enquiryConversion={enquiryConversion}
        calculatorCompletion={calculatorCompletion}
        byStatus={byStatus}
        byLocation={byLocation}
        bySource={bySource}
      />

      <div className="mt-6">
        <PagePerformance pages={pageStats} />
      </div>
    </div>
  );
}
