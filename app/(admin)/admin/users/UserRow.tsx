"use client";

import { useState } from "react";
import { updateUserRole, removeUser, type Role } from "./actions";

export default function UserRow({ id, email, fullName, role, isSelf }: { id: string; email: string; fullName: string; role: Role; isSelf: boolean }) {
  const [current, setCurrent] = useState(role);

  return (
    <tr className="border-b border-base-line last:border-0">
      <td className="px-3 py-2.5 text-base-ink">{fullName}{isSelf && <span className="ml-1.5 text-xs text-base-slate">(you)</span>}</td>
      <td className="px-3 py-2.5 text-base-slate">{email}</td>
      <td className="px-3 py-2.5">
        <select
          value={current}
          disabled={isSelf}
          onChange={async (e) => { const next = e.target.value as Role; setCurrent(next); await updateUserRole(id, next); }}
          className="rounded-lg border border-base-line bg-base-bg px-2 py-1 text-sm text-base-ink disabled:opacity-50"
        >
          <option value="admin">Admin</option>
          <option value="marketing">Marketing</option>
          <option value="sales_resi">Sales — Residential/EV</option>
          <option value="sales_ci">Sales — C&amp;I</option>
        </select>
      </td>
      <td className="px-3 py-2.5">
        {!isSelf && (
          <button onClick={() => removeUser(id)} className="text-xs font-semibold text-status-critical">Remove</button>
        )}
      </td>
    </tr>
  );
}
