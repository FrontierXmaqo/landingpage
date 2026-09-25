"use client";

import { useState, useTransition } from "react";
import { assignProfile, removeUser, type Role } from "./actions";
import { ROLE_OPTIONS } from "./roles";

const fieldClass = "rounded-lg border border-base-line bg-base-bg px-2 py-1 text-sm text-base-ink";

/** A login with no profile: it can sign in but sees nothing until an admin gives it a role here. */
export default function PendingRow({ id, email }: { id: string; email: string }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("marketing");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const save = () =>
    startTransition(async () => {
      setError("");
      try {
        await assignProfile(id, name, role);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save.");
      }
    });

  return (
    <tr className="border-b border-base-line last:border-0">
      <td className="px-3 py-2.5">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={`${fieldClass} w-full`} />
        {error && <p className="mt-1 text-xs text-status-critical">{error}</p>}
      </td>
      <td className="px-3 py-2.5 text-base-slate">{email}</td>
      <td className="px-3 py-2.5">
        <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={fieldClass}>
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </td>
      <td className="whitespace-nowrap px-3 py-2.5">
        <button
          onClick={save}
          disabled={pending || !name.trim()}
          className="rounded-lg bg-brand-green px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Saving…" : "Give access"}
        </button>
        <button onClick={() => removeUser(id)} className="ml-3 text-xs font-semibold text-status-critical">Remove</button>
      </td>
    </tr>
  );
}
