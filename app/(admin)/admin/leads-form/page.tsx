import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import {
  ensureLeadFormDraftSeeded,
  ensureLeadFormFieldsDraftSeeded,
  getLeadFormPublishStatus,
  publishLeadFormOptions,
  unpublishLeadFormOptions,
  discardLeadFormDraft,
} from "./actions";
import LeadFormTable from "./LeadFormTable";
import DiscardDraftButton from "../DiscardDraftButton";
import PublishButton from "../PublishButton";
import { formatMYDateTime } from "@/lib/datetime";

export default async function LeadFormOptionsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  await ensureLeadFormFieldsDraftSeeded();
  await ensureLeadFormDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const [{ data: fields }, { data: rows }, { data: published }, publishStatus] = await Promise.all([
    supabase.from("lead_form_fields").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("lead_form_options").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("lead_form_options").select("published_at").eq("status", "published").limit(1).maybeSingle(),
    getLeadFormPublishStatus(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
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

      <div className="mt-6 flex flex-wrap gap-3">
        <PublishButton
          action={publishLeadFormOptions}
          canRun={publishStatus.canPublish}
          idleHint="Nothing to publish — the draft matches what's already live."
          pendingLabel="Publishing…"
        >
          Publish
        </PublishButton>
        <PublishButton
          action={unpublishLeadFormOptions}
          canRun={publishStatus.canUnpublish}
          idleHint="Nothing to revert to — no earlier published version yet."
          pendingLabel="Reverting…"
          variant="outline"
        >
          Unpublish (revert to previous)
        </PublishButton>
        <DiscardDraftButton action={discardLeadFormDraft} />
      </div>

      <div className="mt-6">
        <LeadFormTable fields={fields ?? []} options={rows ?? []} />
      </div>
    </div>
  );
}
