import { redirect } from "next/navigation";
import { getSupabaseUserClient, getCurrentProfile } from "@/lib/supabase/server";
import {
  ensureLeadFormDraftSeeded,
  ensureLeadFormFieldsDraftSeeded,
  getLeadFormPublishStatus,
  publishLeadFormOptions,
  unpublishLeadFormOptions,
  discardLeadFormDraft,
  type LeadFormPage,
} from "./actions";
import LeadFormTable from "./LeadFormTable";
import DiscardDraftButton from "../DiscardDraftButton";
import PublishButton from "../PublishButton";
import { formatMYDateTime } from "@/lib/datetime";

/** Same per-page brand colour each page uses on the live site (Home's orange,
 *  EV's green, C&I's navy) as the FAQ editor's nav — so this nav visually maps
 *  to the pages it edits instead of reading as three interchangeable tabs. */
const SECTIONS: { page: LeadFormPage; title: string; navLabel: string; hint: string; dot: string }[] = [
  { page: "main", title: "Main Site Lead Form", navLabel: "Main", dot: "#F97000", hint: "The assessment form on the homepage." },
  { page: "ev", title: "EV Lead Form", navLabel: "EV", dot: "#1E9E52", hint: "The assessment form on /ev." },
  { page: "ci", title: "C&I Lead Form", navLabel: "C&I", dot: "#15304F", hint: "Ready to configure ahead of the /commercial-and-industrial enquiry form being wired to the CMS." },
];

async function loadSection(page: LeadFormPage) {
  await ensureLeadFormFieldsDraftSeeded(page);
  await ensureLeadFormDraftSeeded(page);

  const supabase = await getSupabaseUserClient();
  const [{ data: fields }, { data: rows }, { data: published }, publishStatus] = await Promise.all([
    supabase.from("lead_form_fields").select("*").eq("status", "draft").eq("page", page).order("sort_order"),
    supabase.from("lead_form_options").select("*").eq("status", "draft").eq("page", page).order("sort_order"),
    supabase.from("lead_form_options").select("published_at").eq("status", "published").eq("page", page).order("published_at", { ascending: false }).limit(1).maybeSingle(),
    getLeadFormPublishStatus(page),
  ]);
  return {
    fields: fields ?? [],
    options: rows ?? [],
    lastPublished: published?.published_at as string | undefined,
    publishStatus,
  };
}

export default async function LeadFormOptionsPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  const sections = await Promise.all(SECTIONS.map((s) => loadSection(s.page)));

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-base-ink">Lead Form</h1>
        <p className="mt-1 text-sm text-base-slate">
          Fields and dropdown options on the public assessment form, grouped by page. Each page&rsquo;s fields save and
          publish independently.
        </p>
      </div>

      {/* Quick nav: jumps to the matching page's section below, coloured to
          match that page's own identity on the live site — same pattern as
          the FAQ editor's nav. */}
      <nav
        aria-label="Jump to a page's lead form"
        className="sticky top-0 z-10 mt-6 flex w-fit gap-1 rounded-full border border-base-line bg-base-panel/95 p-1 shadow-sm backdrop-blur"
      >
        {SECTIONS.map((section) => (
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
        {SECTIONS.map((section, i) => {
          const { fields, options, lastPublished, publishStatus } = sections[i];
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
                  action={publishLeadFormOptions.bind(null, section.page)}
                  canRun={publishStatus.canPublish}
                  idleHint="Nothing to publish — the draft matches what's already live."
                  pendingLabel="Publishing…"
                >
                  Publish
                </PublishButton>
                <PublishButton
                  action={unpublishLeadFormOptions.bind(null, section.page)}
                  canRun={publishStatus.canUnpublish}
                  idleHint="Nothing to revert to — no earlier published version yet."
                  pendingLabel="Reverting…"
                  variant="outline"
                >
                  Unpublish (revert to previous)
                </PublishButton>
                <DiscardDraftButton action={discardLeadFormDraft.bind(null, section.page)} />
              </div>

              <div className="mt-6">
                <LeadFormTable page={section.page} fields={fields} options={options} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
