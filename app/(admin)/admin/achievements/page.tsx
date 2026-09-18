import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import {
  ensureAchievementsDraftSeeded,
  getAchievementsPublishStatus,
  publishAchievements,
  unpublishAchievements,
  discardAchievementsDraft,
} from "./actions";
import AchievementsEditor, { type AchievementRow } from "./AchievementsEditor";
import DiscardDraftButton from "../DiscardDraftButton";
import PublishButton from "../PublishButton";
import { formatMYDateTime } from "@/lib/datetime";

export default async function AchievementsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  await ensureAchievementsDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const [{ data: items }, { data: published }, publishStatus] = await Promise.all([
    supabase.from("home_achievements").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("home_achievements").select("published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(),
    getAchievementsPublishStatus(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-base-ink">Achievements</h1>
          <p className="mt-1 text-sm text-base-slate">
            The stat band on the homepage (&ldquo;1,000+ Residential Solar Projects Done&rdquo; and the figures next to
            it). Edits save as a draft — publish when you want the public page to show them.
          </p>
        </div>
        {published?.published_at && (
          <span className="text-xs text-base-slate">Last published {formatMYDateTime(published.published_at)}</span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <PublishButton
          action={publishAchievements}
          canRun={publishStatus.canPublish}
          idleHint="Nothing to publish — the draft matches what's already live."
          pendingLabel="Publishing…"
        >
          Publish
        </PublishButton>
        <PublishButton
          action={unpublishAchievements}
          canRun={publishStatus.canUnpublish}
          idleHint="Nothing to revert to — no earlier published version yet."
          pendingLabel="Reverting…"
          variant="outline"
        >
          Unpublish (revert to previous)
        </PublishButton>
        <DiscardDraftButton action={discardAchievementsDraft} />
      </div>

      <div className="mt-8">
        <AchievementsEditor items={(items ?? []) as AchievementRow[]} />
      </div>
    </div>
  );
}
