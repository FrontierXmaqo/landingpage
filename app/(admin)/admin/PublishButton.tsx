"use client";

import { useActionState } from "react";
import type { PublishState } from "./publishState";

const initial: PublishState = { status: "idle" };

const styleByStatus: Record<Exclude<PublishState["status"], "idle">, string> = {
  success: "text-brand-green-ink",
  empty: "text-base-slate",
  error: "text-status-critical",
};

/** Shared Publish/Unpublish button for every CMS section with a draft/publish
 * workflow. Disabled up front when the page already knows there's nothing to
 * do — computed the same way the action itself decides whether to act — and
 * again while the action is running, so neither a stray click nor a slow
 * network turns one publish into two. Reports back whether anything actually
 * happened: archiving live rows and promoting zero to replace them silently
 * empties a section, so "nothing to publish" gets its own message rather than
 * looking identical to a real publish. */
export default function PublishButton({
  action,
  canRun,
  idleHint,
  pendingLabel,
  children,
  variant = "solid",
}: {
  action: (prevState: PublishState, formData: FormData) => Promise<PublishState>;
  /** Whether the page's server-side check found anything for this action to do. */
  canRun: boolean;
  /** Shown when disabled and no action has run yet. */
  idleHint: string;
  pendingLabel: string;
  children: string;
  variant?: "solid" | "outline";
}) {
  const [state, formAction, pending] = useActionState(action, initial);
  const disabled = !canRun || pending;

  const buttonClass =
    variant === "solid"
      ? "rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
      : "rounded-lg border border-status-critical px-4 py-2 text-sm font-semibold text-status-critical transition-transform duration-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 disabled:border-base-line disabled:text-base-slate";

  return (
    <form action={formAction} className="flex flex-col gap-1.5">
      <button disabled={disabled} className={buttonClass}>
        {pending ? pendingLabel : children}
      </button>
      {state.status === "idle" && !canRun && <p className="text-xs text-base-slate">{idleHint}</p>}
      {state.status !== "idle" && (
        <p role="status" className={`text-xs font-medium ${styleByStatus[state.status]}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
