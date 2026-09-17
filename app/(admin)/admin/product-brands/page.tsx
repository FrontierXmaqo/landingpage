import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import {
  ensureBrandLogosDraftSeeded,
  getBrandLogosPublishStatus,
  publishBrandLogos,
  unpublishBrandLogos,
  discardBrandLogosDraft,
} from "./actions";
import BrandLogosEditor, { type BrandRow } from "./BrandLogosEditor";
import DiscardDraftButton from "../DiscardDraftButton";
import PublishButton from "../PublishButton";
import { formatMYDateTime } from "@/lib/datetime";

export default async function ProductBrandsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  await ensureBrandLogosDraftSeeded();

  const supabase = await getSupabaseUserClient();
  const [{ data: brands }, { data: published }, publishStatus] = await Promise.all([
    supabase.from("brand_logos").select("*").eq("status", "draft").order("sort_order"),
    supabase.from("brand_logos").select("published_at").eq("status", "published").order("published_at", { ascending: false }).limit(1).maybeSingle(),
    getBrandLogosPublishStatus(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-base-ink">Product Brands</h1>
          <p className="mt-1 text-sm text-base-slate">
            The &ldquo;Installed with brands homeowners trust&rdquo; strip on the homepage. Edits save as a draft —
            publish when you want the public page to show them.
          </p>
        </div>
        {published?.published_at && (
          <span className="text-xs text-base-slate">Last published {formatMYDateTime(published.published_at)}</span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <PublishButton
          action={publishBrandLogos}
          canRun={publishStatus.canPublish}
          idleHint="Nothing to publish — the draft matches what's already live."
          pendingLabel="Publishing…"
        >
          Publish
        </PublishButton>
        <PublishButton
          action={unpublishBrandLogos}
          canRun={publishStatus.canUnpublish}
          idleHint="Nothing to revert to — no earlier published version yet."
          pendingLabel="Reverting…"
          variant="outline"
        >
          Unpublish (revert to previous)
        </PublishButton>
        <DiscardDraftButton action={discardBrandLogosDraft} />
      </div>

      <div className="mt-8">
        <BrandLogosEditor brands={(brands ?? []) as BrandRow[]} />
      </div>
    </div>
  );
}
