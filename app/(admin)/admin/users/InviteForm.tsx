"use client";

import { useActionState, useState } from "react";
import { inviteUser, type FormState } from "./actions";
import { ROLE_OPTIONS } from "./roles";

const initial: FormState = { status: "idle" };
const fieldClass = "mt-1 w-full rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green";

type Method = "email" | "password";

const METHODS: { value: Method; label: string; hint: string }[] = [
  { value: "email", label: "Email invite", hint: "They get a link to create their own password." },
  { value: "password", label: "Set password now", hint: "No email is sent. Share the password yourself; they change it on first sign-in." },
];

export default function InviteForm() {
  const [state, formAction, pending] = useActionState(inviteUser, initial);
  const [method, setMethod] = useState<Method>("email");

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 rounded-xl border border-base-line bg-base-panel p-5 sm:grid-cols-4 sm:items-end">
      <fieldset className="sm:col-span-4">
        <legend className="text-sm font-medium text-base-ink">How should they get in?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {METHODS.map((m) => (
            <label
              key={m.value}
              className={`flex cursor-pointer gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors duration-150 ${
                method === m.value ? "border-brand-green bg-brand-green/5" : "border-base-line hover:border-base-slate"
              }`}
            >
              <input
                type="radio"
                name="method"
                value={m.value}
                checked={method === m.value}
                onChange={() => setMethod(m.value)}
                className="mt-0.5 accent-brand-green"
              />
              <span>
                <span className="block font-medium text-base-ink">{m.label}</span>
                <span className="block text-xs text-base-slate">{m.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="text-sm font-medium text-base-ink">
        Full name
        <input name="full_name" required className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Work email
        <input name="email" type="email" required className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Role
        <select name="role" defaultValue="marketing" className={fieldClass}>
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      {method === "password" && (
        <label className="text-sm font-medium text-base-ink">
          Temporary password
          <input name="password" type="text" autoComplete="off" minLength={12} maxLength={200} required placeholder="12+ characters" className={fieldClass} />
        </label>
      )}
      <button
        disabled={pending}
        className={`rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98] disabled:opacity-60 ${
          method === "password" ? "sm:col-span-4 sm:justify-self-end" : ""
        }`}
      >
        {pending ? "Working…" : method === "password" ? "Create account" : "Send invite"}
      </button>
      {state.status !== "idle" && (
        <p className={`sm:col-span-4 text-sm ${state.status === "error" ? "text-status-critical" : "text-brand-green-ink"}`}>{state.message}</p>
      )}
    </form>
  );
}
