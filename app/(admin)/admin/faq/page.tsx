import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import {
  ensureFaqDraftSeeded,
  getFaqPublishStatus,
  publishFaq,
  unpublishFaq,
  discardFaqDraft,
  type FaqPage,
} from "./actions";
import FaqListEditor, { type FaqRow } from "./FaqListEditor";
import DiscardDraftButton from "../DiscardDraftButton";
import PublishButton from "../PublishButton";
import { formatMYDateTime } from "@/lib/datetime";

const SECTIONS: { page: FaqPage; title: string; hint: string }[] = [
  { page: "residential", title: "Residential FAQ", hint: "Shown on the homepage, under “Everything homeowners ask about ATAP.”" },
  { page: "ev", title: "EV FAQ", hint: "Shown on /ev, under “What EV owners ask us.”" },
  { page: "ci", title: "C&I FAQ", hint: "Not shown on /commercial-and-industrial until at least one question here is published." },
];

async function loadSection(page: FaqPage) {
  await ensureFaqDraftSeeded(page);
  const supabase = await getSupabaseUserClient();
  const [{ data: items }, { data: published }, publishStatus] = await Promise.all([
    supabase.from("faqs").select("id, question, answer").eq("status", "draft").eq("page", page).order("sort_order"),
    supabase.from("faqs").select("published_at").eq("status", "published").eq("page", page).order("published_at", { ascending: false }).limit(1).maybeSingle(),
    getFaqPublishStatus(page),
  ]);
  return {
    items: (items ?? []) as FaqRow[],
    lastPublished: published?.published_at as string | undefined,
    publishStatus,
  };
}

export default async function FaqAdminPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  const sections = await Promise.all(SECTIONS.map((s) => loadSection(s.page)));

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-base-ink">FAQ</h1>
        <p className="mt-1 text-sm text-base-slate">
          Every FAQ accordion on the site, grouped by page. Each page&rsquo;s questions save and publish independently.
        </p>
      </div>

      <div className="mt-8 space-y-12">
        {SECTIONS.map((section, i) => {
          const { items, lastPublished, publishStatus } = sections[i];
          return (
            <section key={section.page}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-base-ink">{section.title}</h2>
                  <p className="mt-0.5 text-sm text-base-slate">{section.hint}</p>
                </div>
                {lastPublished && <span className="text-xs text-base-slate">Last published {formatMYDateTime(lastPublished)}</span>}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <PublishButton
                  action={publishFaq.bind(null, section.page)}
                  canRun={publishStatus.canPublish}
                  idleHint="Nothing to publish — the draft matches what's already live."
                  pendingLabel="Publishing…"
                >
                  Publish
                </PublishButton>
                <PublishButton
                  action={unpublishFaq.bind(null, section.page)}
                  canRun={publishStatus.canUnpublish}
                  idleHint="Nothing to revert to — no earlier published version yet."
                  pendingLabel="Reverting…"
                  variant="outline"
                >
                  Unpublish (revert to previous)
                </PublishButton>
                <DiscardDraftButton action={discardFaqDraft.bind(null, section.page)} />
              </div>

              <div className="mt-4">
                <FaqListEditor page={section.page} items={items} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
