"use client";

import { useActionState } from "react";
import { inviteUser, type FormState } from "./actions";

const initial: FormState = { status: "idle" };
const fieldClass = "mt-1 w-full rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green";

export default function InviteForm() {
  const [state, formAction] = useActionState(inviteUser, initial);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 rounded-xl border border-base-line bg-base-panel p-5 sm:grid-cols-4 sm:items-end">
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
          <option value="admin">Admin</option>
          <option value="marketing">Marketing</option>
          <option value="sales_resi">Sales - Residential/EV</option>
          <option value="sales_ci">Sales - C&amp;I</option>
        </select>
      </label>
      <button className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98]">
        Send invite
      </button>
      {state.status !== "idle" && (
        <p className={`sm:col-span-4 text-sm ${state.status === "error" ? "text-status-critical" : "text-brand-green-ink"}`}>{state.message}</p>
      )}
    </form>
  );
}
