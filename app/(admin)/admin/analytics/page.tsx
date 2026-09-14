import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import Charts from "./Charts";

function startOfMonthISO() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

export default async function AnalyticsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/admin/login");

  const since = startOfMonthISO();
  const supabase = await getSupabaseUserClient();

  const [{ data: events }, { data: leads }] = await Promise.all([
    supabase.from("analytics_events").select("event_type, session_id").gte("created_at", since),
    supabase.from("atap_leads").select("status, lead_source, state").gte("created_at", since),
  ]);

  const distinctSessions = (type: string) => new Set((events ?? []).filter((e) => e.event_type === type).map((e) => e.session_id)).size;
  const visitors = distinctSessions("pageview");
  const calculatorUsers = distinctSessions("calculator_start");
  const enquiries = leads?.length ?? 0;

  const enquiryConversion = visitors ? (enquiries / visitors) * 100 : 0;
  const calculatorCompletion = calculatorUsers ? (enquiries / calculatorUsers) * 100 : 0;

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
    </div>
  );
}
