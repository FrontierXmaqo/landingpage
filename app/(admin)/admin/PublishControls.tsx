import DiscardDraftButton from "./DiscardDraftButton";
import PublishButton from "./PublishButton";
import type { PublishState } from "./publishState";

type PublishAction = (prevState: PublishState, formData: FormData) => Promise<PublishState>;

/** The Publish / Unpublish / Discard row every draft-and-publish CMS section shares. */
export default function PublishControls({
  publish,
  unpublish,
  discard,
  status,
  className = "mt-4",
}: {
  publish: PublishAction;
  unpublish: PublishAction;
  discard: () => Promise<void>;
  status: { canPublish: boolean; canUnpublish: boolean };
  className?: string;
}) {
  return (
    <div className={`${className} flex flex-wrap gap-3`}>
      <PublishButton
        action={publish}
        canRun={status.canPublish}
        idleHint="Nothing to publish - the draft matches what's already live."
        pendingLabel="Publishing…"
      >
        Publish
      </PublishButton>
      <PublishButton
        action={unpublish}
        canRun={status.canUnpublish}
        idleHint="Nothing to revert to - no earlier published version yet."
        pendingLabel="Reverting…"
        variant="outline"
      >
        Unpublish (revert to previous)
      </PublishButton>
      <DiscardDraftButton action={discard} />
    </div>
  );
}
