"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createFirstAdmin, signIn, type FormState } from "./actions";

const initialState: FormState = { status: "idle" };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand-green px-4 py-2.5 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98] disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export default function LoginForm({ firstRun }: { firstRun: boolean }) {
  const [state, formAction] = useActionState(createFirstAdmin, initialState);
  const [signInState, signInAction] = useActionState(signIn, initialState);

  const fieldClass =
    "w-full rounded-lg border border-base-line bg-base-bg px-3 py-2.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green";

  if (firstRun) {
    if (state.status === "success") {
      return (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-brand-green-ink">Admin account created.</p>
          <a href="/admin/login" className="block w-full rounded-lg bg-brand-green px-4 py-2.5 text-center text-sm font-semibold text-white">
            Sign in
          </a>
        </div>
      );
    }
    return (
      <form action={formAction} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-base-ink">
          Full name
          <input name="full_name" required className={`mt-1.5 ${fieldClass}`} />
        </label>
        <label className="block text-sm font-medium text-base-ink">
          Work email
          <input name="email" type="email" required className={`mt-1.5 ${fieldClass}`} />
        </label>
        <label className="block text-sm font-medium text-base-ink">
          Password
          <input name="password" type="password" required minLength={12} autoComplete="new-password" className={`mt-1.5 ${fieldClass}`} />
        </label>
        {state.status === "error" && <p className="text-sm text-status-critical">{state.message}</p>}
        <SubmitButton label="Create admin account" pendingLabel="Creating…" />
      </form>
    );
  }

  return (
    <form action={signInAction} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-base-ink">
        Work email
        <input name="email" type="email" required className={`mt-1.5 ${fieldClass}`} />
      </label>
      <label className="block text-sm font-medium text-base-ink">
        Password
        <input name="password" type="password" required className={`mt-1.5 ${fieldClass}`} />
      </label>
      {signInState.status === "error" && <p className="text-sm text-status-critical">{signInState.message}</p>}
      <SubmitButton label="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}
