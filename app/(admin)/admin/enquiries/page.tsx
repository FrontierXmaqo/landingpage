import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import { SEGMENT_DOT } from "@/lib/segments";
import EnquiryRow from "./EnquiryRow";
import CiEnquiryRow from "./CiEnquiryRow";

/**
 * Leads, split by business line and scoped to the signed-in role.
 *
 * sales_resi sees Residential and EV; sales_ci sees C&I; admin sees
 * everything. The scoped table is simply never queried, so an out-of-scope
 * lead does not reach the page at all.
 *
 * Residential and EV share atap_leads and are told apart by its segment
 * column. Before that column existed nothing recorded which form a lead came
 * from, so older rows are genuinely unclassifiable — they get their own
 * section rather than being quietly counted as Residential.
 *
 * Colours are each line's own identity on the live site, shared with the FAQ,
 * Lead Form and Analytics screens.
 */

type Section = { id: string; label: string; hint: string; dot: string };

const RESIDENTIAL: Section = {
  id: "residential",
  label: "Residential",
  hint: "Enquiries from the homepage assessment form.",
  dot: SEGMENT_DOT.residential,
};
const CI: Section = { id: "ci", label: "C&I", hint: "Enquiries from /commercial-and-industrial.", dot: SEGMENT_DOT.ci };
const EV: Section = { id: "ev", label: "EV", hint: "Enquiries from /ev.", dot: SEGMENT_DOT.ev };
const UNCLASSIFIED: Section = {
  id: "unclassified",
  label: "Unclassified",
  hint: "Received before Residential and EV were recorded separately.",
  dot: SEGMENT_DOT.shared,
};

const ATAP_COLUMNS = ["Contact", "State", "Source", "Status", "Received", "Notes"];
const CI_COLUMNS = ["Contact", "Company / Industry", "State", "Bill range", "Status", "Received", "Notes"];

function Heading({ section, count }: { section: Section; count: number }) {
  return (
    <>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-base-ink">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: section.dot }} />
        {section.label}
      </h2>
      <p className="mt-0.5 text-sm text-base-slate">
        {count} {count === 1 ? "enquiry" : "enquiries"}. {section.hint}
      </p>
    </>
  );
}

function Table({ columns, rows, empty }: { columns: string[]; rows: React.ReactNode[]; empty: string }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-base-line bg-base-panel">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 border-b border-base-line bg-base-bg text-xs uppercase text-base-slate">
          <tr>
            {columns.map((c) => (
              <th key={c} scope="col" className="px-3 py-2">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-sm text-base-slate">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function EnquiriesPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing", "sales_resi", "sales_ci"].includes(profile.role)) redirect("/admin");
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

  const atap = leads ?? [];
  const residential = atap.filter((l) => l.segment === "residential");
  const ev = atap.filter((l) => l.segment === "ev");
  const unclassified = atap.filter((l) => l.segment !== "residential" && l.segment !== "ev");
  const ci = ciLeads ?? [];

  const sections: { section: Section; count: number }[] = [
    ...(showResi ? [{ section: RESIDENTIAL, count: residential.length }] : []),
    ...(showCi ? [{ section: CI, count: ci.length }] : []),
    ...(showResi ? [{ section: EV, count: ev.length }] : []),
    ...(showResi && unclassified.length ? [{ section: UNCLASSIFIED, count: unclassified.length }] : []),
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-base-ink">Customer Enquiries</h1>
      <p className="mt-1 text-sm text-base-slate">Update status and notes as you follow up.</p>

      <nav
        aria-label="Jump to a lead list"
        className="sticky top-0 z-10 mt-6 flex w-fit flex-wrap gap-1 rounded-full border border-base-line bg-base-panel/95 p-1 shadow-sm backdrop-blur"
      >
        {sections.map(({ section, count }) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-base-slate transition hover:bg-base-bg hover:text-base-ink"
          >
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: section.dot }} />
            {section.label}
            <span className="tabular-nums text-base-slate">{count}</span>
          </a>
        ))}
      </nav>

      {showResi && (
        <section id="residential" className="mt-8 scroll-mt-20">
          <Heading section={RESIDENTIAL} count={residential.length} />
          <Table
            columns={ATAP_COLUMNS}
            empty="No residential enquiries yet."
            rows={residential.map((lead) => (
              <EnquiryRow key={lead.id} lead={lead} />
            ))}
          />
        </section>
      )}

      {showCi && (
        <section id="ci" className="mt-12 scroll-mt-20">
          <Heading section={CI} count={ci.length} />
          <Table
            columns={CI_COLUMNS}
            empty="No C&I enquiries yet."
            rows={ci.map((lead) => (
              <CiEnquiryRow key={lead.id} lead={lead} />
            ))}
          />
        </section>
      )}

      {showResi && (
        <section id="ev" className="mt-12 scroll-mt-20">
          <Heading section={EV} count={ev.length} />
          <Table
            columns={ATAP_COLUMNS}
            empty="No EV enquiries yet."
            rows={ev.map((lead) => (
              <EnquiryRow key={lead.id} lead={lead} />
            ))}
          />
        </section>
      )}

      {showResi && unclassified.length > 0 && (
        <section id="unclassified" className="mt-12 scroll-mt-20">
          <Heading section={UNCLASSIFIED} count={unclassified.length} />
          <Table
            columns={ATAP_COLUMNS}
            empty="Nothing unclassified."
            rows={unclassified.map((lead) => (
              <EnquiryRow key={lead.id} lead={lead} />
            ))}
          />
        </section>
      )}
    </div>
  );
}
