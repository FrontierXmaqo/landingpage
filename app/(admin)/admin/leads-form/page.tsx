import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import {
  ensureLeadFormDraftSeeded,
  ensureLeadFormFieldsDraftSeeded,
  publishLeadFormOptions,
  unpublishLeadFormOptions,
  discardLeadFormDraft,
} from "./actions";
import OptionField from "./OptionField";
import FieldsManager from "./FieldsManager";
import DiscardDraftButton from "../DiscardDraftButton";
import { formatMYDateTime } from "@/lib/datetime";

export default async function LeadFormOptionsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  await ensureLeadFormFieldsDraftSeeded();
  await ensureLeadFormDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const [{ data: fields }, { data: rows }, { data: published }] = await Promise.all([
    supabase.from("lead_form_fields").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("lead_form_options").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("lead_form_options").select("published_at").eq("status", "published").limit(1).maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-ink">Lead Form</h1>
          <p className="mt-1 text-sm text-base-slate">
            Add, edit, or remove fields and their dropdown options on the public assessment form.
          </p>
        </div>
        {published?.published_at && (
          <span className="text-xs text-base-slate">Last published {formatMYDateTime(published.published_at)}</span>
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
        <DiscardDraftButton action={discardLeadFormDraft} />
      </div>

      <div className="mt-6">
        <FieldsManager fields={fields ?? []} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {(fields ?? []).map((field) => (
          <OptionField
            key={field.id}
            field={field.field_key}
            label={field.label}
            options={(rows ?? []).filter((r) => r.field_name === field.field_key).map((r) => ({ id: r.id, value: r.value }))}
          />
        ))}
      </div>
    </div>
  );
}
