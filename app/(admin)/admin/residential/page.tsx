import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import {
  ensureBrandLogosDraftSeeded,
  getBrandLogosPublishStatus,
  publishBrandLogos,
  unpublishBrandLogos,
  discardBrandLogosDraft,
} from "../product-brands/actions";
import BrandLogosEditor, { type BrandRow } from "../product-brands/BrandLogosEditor";
import {
  ensureAchievementsDraftSeeded,
  getAchievementsPublishStatus,
  publishAchievements,
  unpublishAchievements,
  discardAchievementsDraft,
} from "../achievements/actions";
import AchievementsEditor, { type AchievementRow } from "../achievements/AchievementsEditor";
import { ensureEvDraftSeeded, publishEvCalculator, unpublishEvCalculator, discardEvConfigDraft } from "../calculator-ev/actions";
import ConfigForm from "../calculator-ev/ConfigForm";
import DiscardDraftButton from "../DiscardDraftButton";
import PublishButton from "../PublishButton";
import { formatMYDateTime } from "@/lib/datetime";

export default async function ResidentialPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  await Promise.all([ensureBrandLogosDraftSeeded(), ensureAchievementsDraftSeeded(), ensureEvDraftSeeded()]);

  const supabase = await getSupabaseUserClient();
  const [
    { data: brands },
    { data: brandsPublished },
    brandsStatus,
    { data: achievements },
    { data: achievementsPublished },
    achievementsStatus,
    { data: draftConfig },
    { data: configPublished },
  ] = await Promise.all([
    supabase.from("brand_logos").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("brand_logos").select("published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(),
    getBrandLogosPublishStatus(),
    supabase.from("home_achievements").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("home_achievements").select("published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(),
    getAchievementsPublishStatus(),
    supabase.from("ev_calculator_config").select("*").eq("status", "draft").maybeSingle(),
    supabase.from("ev_calculator_config").select("published_at").eq("status", "published").maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-base-ink">Residential Page</h1>
        <p className="mt-1 text-sm text-base-slate">
          Brand logos, achievement stats and the /ev calculator&rsquo;s formula — everything the residential homepage
          pulls from the CMS. Each section below saves and publishes on its own.
        </p>
      </div>

      <div className="mt-10 space-y-12">
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-base-ink">Product Brands</h2>
              <p className="mt-0.5 text-sm text-base-slate">
                The &ldquo;Installed with brands homeowners trust&rdquo; strip on the homepage.
              </p>
            </div>
            {brandsPublished?.published_at && (
              <span className="text-xs text-base-slate">Last published {formatMYDateTime(brandsPublished.published_at)}</span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <PublishButton
              action={publishBrandLogos}
              canRun={brandsStatus.canPublish}
              idleHint="Nothing to publish — the draft matches what's already live."
              pendingLabel="Publishing…"
            >
              Publish
            </PublishButton>
            <PublishButton
              action={unpublishBrandLogos}
              canRun={brandsStatus.canUnpublish}
              idleHint="Nothing to revert to — no earlier published version yet."
              pendingLabel="Reverting…"
              variant="outline"
            >
              Unpublish (revert to previous)
            </PublishButton>
            <DiscardDraftButton action={discardBrandLogosDraft} />
          </div>
          <div className="mt-6">
            <BrandLogosEditor brands={(brands ?? []) as BrandRow[]} />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-base-ink">Achievements</h2>
              <p className="mt-0.5 text-sm text-base-slate">
                The stat band on the homepage (&ldquo;1,000+ Residential Solar Projects Done&rdquo; and the figures next to
                it).
              </p>
            </div>
            {achievementsPublished?.published_at && (
              <span className="text-xs text-base-slate">Last published {formatMYDateTime(achievementsPublished.published_at)}</span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <PublishButton
              action={publishAchievements}
              canRun={achievementsStatus.canPublish}
              idleHint="Nothing to publish — the draft matches what's already live."
              pendingLabel="Publishing…"
            >
              Publish
            </PublishButton>
            <PublishButton
              action={unpublishAchievements}
              canRun={achievementsStatus.canUnpublish}
              idleHint="Nothing to revert to — no earlier published version yet."
              pendingLabel="Reverting…"
              variant="outline"
            >
              Unpublish (revert to previous)
            </PublishButton>
            <DiscardDraftButton action={discardAchievementsDraft} />
          </div>
          <div className="mt-6">
            <AchievementsEditor items={(achievements ?? []) as AchievementRow[]} />
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-base-ink">Calculator Settings</h2>
              <p className="mt-0.5 text-sm text-base-slate">The formula the /ev landing page&rsquo;s calculator uses.</p>
            </div>
            {configPublished?.published_at && (
              <span className="text-xs text-base-slate">Last published {formatMYDateTime(configPublished.published_at)}</span>
            )}
          </div>
          <div className="mt-4 flex gap-3">
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
          {draftConfig && (
            <div className="mt-6">
              <ConfigForm config={draftConfig} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
