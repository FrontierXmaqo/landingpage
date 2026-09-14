"use client";

import { useState } from "react";
import { addOption, removeOption, moveOption } from "./actions";
import type { FieldName } from "./fields";

export default function OptionField({
  field,
  label,
  options,
}: {
  field: FieldName;
  label: string;
  options: { id: string; value: string }[];
}) {
  const [newValue, setNewValue] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div className="rounded-xl border border-base-line bg-base-panel p-5">
      <h3 className="text-sm font-semibold text-base-ink">{label}</h3>
      <ul className="mt-3 space-y-1.5">
        {options.map((opt, i) => (
          <li key={opt.id} className="flex items-center justify-between gap-2 rounded-lg bg-base-bg px-3 py-1.5 text-sm text-base-ink">
            <span>{opt.value}</span>
            <span className="flex items-center gap-1">
              <button type="button" disabled={i === 0} onClick={() => moveOption(opt.id, "up", field)} className="px-1.5 text-base-slate disabled:opacity-30">↑</button>
              <button type="button" disabled={i === options.length - 1} onClick={() => moveOption(opt.id, "down", field)} className="px-1.5 text-base-slate disabled:opacity-30">↓</button>
              <button type="button" onClick={() => removeOption(opt.id)} className="ml-1 text-xs font-semibold text-status-critical">Remove</button>
            </span>
          </li>
        ))}
        {!options.length && <li className="text-sm text-base-slate">No options yet.</li>}
      </ul>
      <form
        className="mt-3 flex gap-2"
        action={async () => {
          setPending(true);
          await addOption(field, newValue);
          setNewValue("");
          setPending(false);
        }}
      >
        <input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Add option…"
          className="flex-1 rounded-lg border border-base-line bg-base-bg px-3 py-1.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
        />
        <button disabled={pending || !newValue.trim()} className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
          Add
        </button>
      </form>
    </div>
  );
}
