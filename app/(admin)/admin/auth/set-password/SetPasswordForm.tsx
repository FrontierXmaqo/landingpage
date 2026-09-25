"use client";

import { useActionState } from "react";
import { setPassword, type SetPasswordState } from "./actions";

const initial: SetPasswordState = { status: "idle" };
const fieldClass =
  "mt-1 w-full rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";

export default function SetPasswordForm() {
  const [state, formAction, pending] = useActionState(setPassword, initial);
  return (
    <form action={formAction} className="mt-6 grid gap-4">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg border border-status-critical/40 bg-status-critical/5 px-3 py-2 text-sm text-status-critical">
          {state.message}
        </p>
      )}
      <label className="text-sm font-medium text-base-ink">
        New password
        <input name="password" type="password" autoComplete="new-password" minLength={12} required className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Confirm password
        <input name="confirm" type="password" autoComplete="new-password" minLength={12} required className={fieldClass} />
      </label>
      <button
        disabled={pending}
        className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save password"}
      </button>
    </form>
  );
}
