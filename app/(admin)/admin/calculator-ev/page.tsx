import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import { ensureEvDraftSeeded, publishEvCalculator, unpublishEvCalculator, discardEvConfigDraft } from "./actions";
import ConfigForm from "./ConfigForm";
import DiscardDraftButton from "../DiscardDraftButton";
import { formatMYDateTime } from "@/lib/datetime";

export default async function EvCalculatorSettingsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing", "sales_resi"].includes(profile.role)) redirect("/admin");

  await ensureEvDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const [{ data: draftConfig }, { data: publishedConfig }] = await Promise.all([
    supabase.from("ev_calculator_config").select("*").eq("status", "draft").maybeSingle(),
    supabase.from("ev_calculator_config").select("published_at").eq("status", "published").maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-ink">EV Landing Page Calculator</h1>
          <p className="mt-1 text-sm text-base-slate">
            Edit the formula the /ev calculator uses. Changes save as a draft — publish when ready for the public page to show them.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-base-slate">
          {publishedConfig?.published_at && (
            <span>Last published {formatMYDateTime(publishedConfig.published_at)}</span>
          )}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <form action={publishEvCalculator}>
          <button className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98]">
            Publish
          </button>
        </form>
        <form action={unpublishEvCalculator}>
          <button className="rounded-lg border border-status-critical px-4 py-2 text-sm font-semibold text-status-critical transition-transform duration-100 active:scale-[0.98]">
            Unpublish (revert to previous)
          </button>
        </form>
        <DiscardDraftButton action={discardEvConfigDraft} />
      </div>

      {draftConfig && <ConfigForm config={draftConfig} />}
    </div>
  );
}
