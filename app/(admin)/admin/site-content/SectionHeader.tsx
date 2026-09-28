import type { SiteSection } from "@/lib/siteContent";
import { formatMYDateTime } from "@/lib/datetime";
import PublishControls from "../PublishControls";
import { discardSectionDraft, publishSection, unpublishSection } from "./actions";

/** Title, last-published stamp and the shared Publish row for one site_content section. */
export default function SectionHeader({
  section,
  title,
  hint,
  lastPublished,
  status,
}: {
  section: SiteSection;
  title: string;
  hint: string;
  lastPublished?: string;
  status: { canPublish: boolean; canUnpublish: boolean };
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-base-ink">{title}</h2>
          <p className="mt-0.5 text-sm text-base-slate">{hint}</p>
        </div>
        <span className="text-xs text-base-slate">
          {lastPublished ? `Last published ${formatMYDateTime(lastPublished)}` : "Never published - the site shows its built-in content"}
        </span>
      </div>
      <PublishControls
        publish={publishSection.bind(null, section)}
        unpublish={unpublishSection.bind(null, section)}
        discard={discardSectionDraft.bind(null, section)}
        status={status}
      />
    </>
  );
}
