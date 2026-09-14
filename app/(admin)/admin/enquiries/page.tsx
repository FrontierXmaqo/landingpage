import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import EnquiryRow from "./EnquiryRow";

export default async function EnquiriesPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "sales"].includes(profile.role)) redirect("/admin");

  const supabase = await getSupabaseUserClient();
  const { data: leads } = await supabase.from("atap_leads").select("*").order("created_at", { ascending: false }).limit(200);

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-ink">Customer Enquiries</h1>
      <p className="mt-1 text-sm text-base-slate">{leads?.length ?? 0} enquiries. Update status and notes as you follow up.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-base-line bg-base-panel">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 border-b border-base-line bg-base-bg text-xs uppercase text-base-slate">
            <tr>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">State</th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Received</th>
              <th className="px-3 py-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((lead) => <EnquiryRow key={lead.id} lead={lead} />)}
            {!leads?.length && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-sm text-base-slate">No enquiries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
