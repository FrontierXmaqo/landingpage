import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import { ensureLeadFormDraftSeeded, publishLeadFormOptions, unpublishLeadFormOptions, FIELDS } from "./actions";
import OptionField from "./OptionField";

const LABELS: Record<(typeof FIELDS)[number], string> = {
  salutation: "Salutation",
  state: "State",
  bill_range: "Monthly TNB bill range",
  property_type: "Property type",
  electric_supply: "Electric supply",
  language: "Preferred language",
};

export default async function LeadFormOptionsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  await ensureLeadFormDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const { data: rows } = await supabase.from("lead_form_options").select("*").eq("status", "draft").order("sort_order");
  const { data: published } = await supabase.from("lead_form_options").select("published_at").eq("status", "published").limit(1).maybeSingle();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-ink">Lead Form</h1>
          <p className="mt-1 text-sm text-base-slate">
            Add, remove, or reorder the dropdown options shown on the public assessment form.
          </p>
        </div>
        {published?.published_at && (
          <span className="text-xs text-base-slate">Last published {new Date(published.published_at).toLocaleString("en-MY")}</span>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <form action={publishLeadFormOptions}>
          <button className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98]">Publish</button>
        </form>
        <form action={unpublishLeadFormOptions}>
          <button className="rounded-lg border border-status-critical px-4 py-2 text-sm font-semibold text-status-critical transition-transform duration-100 active:scale-[0.98]">
            Unpublish (revert to previous)
          </button>
        </form>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <OptionField
            key={field}
            field={field}
            label={LABELS[field]}
            options={(rows ?? []).filter((r) => r.field_name === field).map((r) => ({ id: r.id, value: r.value }))}
          />
        ))}
      </div>
    </div>
  );
}
