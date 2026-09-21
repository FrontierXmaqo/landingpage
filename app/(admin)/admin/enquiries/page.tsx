import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import EnquiryRow from "./EnquiryRow";
import CiEnquiryRow from "./CiEnquiryRow";

/** Same per-page brand colour as the FAQ/Lead Form editors' nav (Home's
 *  orange, C&I's navy) — Residential and EV share one table (atap_leads
 *  doesn't record which of the two a lead came from), so they stay one
 *  section rather than three. */
const SECTIONS = [
  { id: "residential-ev", label: "Residential & EV", dot: "#F97000" },
  { id: "ci", label: "C&I", dot: "#15304F" },
];

export default async function EnquiriesPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "sales_resi", "sales_ci"].includes(profile.role)) redirect("/admin");
  const showResi = profile.role !== "sales_ci";
  const showCi = profile.role !== "sales_resi";

  const supabase = await getSupabaseUserClient();
  const [{ data: leads }, { data: ciLeads }] = await Promise.all([
    showResi
      ? supabase.from("atap_leads").select("*").order("created_at", { ascending: false }).limit(200)
      : Promise.resolve({ data: null }),
    showCi
      ? supabase.from("ci_leads").select("*").order("created_at", { ascending: false }).limit(200)
      : Promise.resolve({ data: null }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-ink">Customer Enquiries</h1>
      <p className="mt-1 text-sm text-base-slate">Update status and notes as you follow up.</p>

      <nav
        aria-label="Jump to a lead list"
        className="sticky top-0 z-10 mt-6 flex w-fit gap-1 rounded-full border border-base-line bg-base-panel/95 p-1 shadow-sm backdrop-blur"
      >
        {SECTIONS.filter((s) => (s.id === "ci" ? showCi : showResi)).map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-base-slate transition hover:bg-base-bg hover:text-base-ink"
          >
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: s.dot }} />
            {s.label}
          </a>
        ))}
      </nav>

      {showResi && <section id="residential-ev" className="mt-8 scroll-mt-20">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-base-ink">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#F97000" }} />
          Residential &amp; EV
        </h2>
        <p className="mt-0.5 text-sm text-base-slate">{leads?.length ?? 0} enquiries from the homepage and /ev.</p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-base-line bg-base-panel">
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
              {(leads ?? []).map((lead) => (
                <EnquiryRow key={lead.id} lead={lead} />
              ))}
              {!leads?.length && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-sm text-base-slate">
                    No enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>}

      {showCi && <section id="ci" className="mt-12 scroll-mt-20">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-base-ink">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#15304F" }} />
          C&amp;I
        </h2>
        <p className="mt-0.5 text-sm text-base-slate">{ciLeads?.length ?? 0} enquiries from /commercial-and-industrial.</p>

        <div className="mt-4 overflow-x-auto rounded-xl border border-base-line bg-base-panel">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-base-line bg-base-bg text-xs uppercase text-base-slate">
              <tr>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Company / Industry</th>
                <th className="px-3 py-2">State</th>
                <th className="px-3 py-2">Bill range</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Received</th>
                <th className="px-3 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {(ciLeads ?? []).map((lead) => (
                <CiEnquiryRow key={lead.id} lead={lead} />
              ))}
              {!ciLeads?.length && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-sm text-base-slate">
                    No C&amp;I enquiries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>}
    </div>
  );
}
