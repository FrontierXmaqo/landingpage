import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import { ensureCiDraftSeeded, getCiPublishStatus, publishCiContent, unpublishCiContent, discardCiDraft } from "./actions";
import CiEditor, { type ClientRow, type ProjectRow, type StatRow } from "./CiEditor";
import PublishControls from "../PublishControls";
import { formatMYDateTime } from "@/lib/datetime";

export default async function CommercialIndustrialPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing", "sales_ci"].includes(profile.role)) redirect("/admin");

  await ensureCiDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const [{ data: projects }, { data: clients }, { data: stats }, { data: published }, publishStatus] = await Promise.all([
    supabase.from("ci_projects").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("ci_clients").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("ci_trust_stats").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("ci_projects").select("published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(),
    getCiPublishStatus(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-base-ink">Commercial &amp; Industrial Page</h1>
          <p className="mt-1 text-sm text-base-slate">
            Projects, client roster and trust stats on the /commercial-and-industrial page. Edits save as a
            draft - publish when you want the public page to show them.
          </p>
        </div>
        {published?.published_at && (
          <span className="text-xs text-base-slate">Last published {formatMYDateTime(published.published_at)}</span>
        )}
      </div>

      <PublishControls
        publish={publishCiContent}
        unpublish={unpublishCiContent}
        discard={discardCiDraft}
        status={publishStatus}
        className="mt-6"
      />

      <div className="mt-8">
        <CiEditor
          projects={(projects ?? []) as ProjectRow[]}
          clients={(clients ?? []) as ClientRow[]}
          stats={(stats ?? []) as StatRow[]}
        />
      </div>
    </div>
  );
}
