"use client";

/** Shared "throw away my in-progress draft edits" button — guarded behind a
 * confirm() since it's destructive to unsaved work, and resets the draft back
 * to match whatever is currently published. Used by every CMS section that has
 * a draft/publish workflow. */
export default function DiscardDraftButton({ action }: { action: () => Promise<void> }) {
  return (
    <form
      action={async () => {
        if (!window.confirm("Discard all unsaved draft changes? This can't be undone, but the draft will reset to match what's currently published.")) return;
        await action();
      }}
    >
      <button className="rounded-lg border border-base-line px-4 py-2 text-sm font-semibold text-base-slate transition-colors duration-150 hover:border-status-critical hover:text-status-critical">
        Discard draft changes
      </button>
    </form>
  );
}
