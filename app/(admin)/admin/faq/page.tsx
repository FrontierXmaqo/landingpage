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

/** Same per-page brand colour each page uses on the live site (Home's
 *  orange, EV's green, C&I's navy), so this nav visually maps to the pages
 *  it edits instead of reading as three interchangeable tabs. */
const SECTIONS: { page: FaqPage; title: string; navLabel: string; hint: string; dot: string }[] = [
  { page: "residential", title: "Residential FAQ", navLabel: "Residential", dot: "#F97000", hint: "Shown on the homepage, under “Everything homeowners ask about ATAP.”" },
  { page: "ev", title: "EV FAQ", navLabel: "EV", dot: "#1E9E52", hint: "Shown on /ev, under “What EV owners ask us.”" },
  { page: "ci", title: "C&I FAQ", navLabel: "C&I", dot: "#15304F", hint: "Not shown on /commercial-and-industrial until at least one question here is published." },
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

/** Sales roles are scoped to their own category's page(s) — same split as the
 *  EV calculator, C&I editor and lead form. Admin/marketing see every page. */
function visiblePages(role: string): FaqPage[] | null {
  if (role === "sales_resi") return ["residential", "ev"];
  if (role === "sales_ci") return ["ci"];
  return null;
}

export default async function FaqAdminPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing", "sales_resi", "sales_ci"].includes(profile.role)) redirect("/admin");
  const allowed = visiblePages(profile.role);
  const sectionDefs = allowed ? SECTIONS.filter((s) => allowed.includes(s.page)) : SECTIONS;

  const sections = await Promise.all(sectionDefs.map((s) => loadSection(s.page)));

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-base-ink">FAQ</h1>
        <p className="mt-1 text-sm text-base-slate">
          Every FAQ accordion on the site, grouped by page. Each page&rsquo;s questions save and publish independently.
        </p>
      </div>

      {/* Quick nav: jumps to the matching page's section below, coloured to
          match that page's own identity on the live site. */}
      <nav
        aria-label="Jump to a page's FAQ"
        className="sticky top-0 z-10 mt-6 flex w-fit gap-1 rounded-full border border-base-line bg-base-panel/95 p-1 shadow-sm backdrop-blur"
      >
        {sectionDefs.map((section) => (
          <a
            key={section.page}
            href={`#${section.page}`}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-base-slate transition hover:bg-base-bg hover:text-base-ink"
          >
            <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: section.dot }} />
            {section.navLabel}
          </a>
        ))}
      </nav>

      <div className="mt-8 space-y-12">
        {sectionDefs.map((section, i) => {
          const { items, lastPublished, publishStatus } = sections[i];
          return (
            <section key={section.page} id={section.page} className="scroll-mt-20">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-base-ink">
                    <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: section.dot }} />
                    {section.title}
                  </h2>
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
