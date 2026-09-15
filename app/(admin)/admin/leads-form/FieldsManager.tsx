"use client";

import { useState } from "react";
import { addField, updateFieldLabel, removeField, moveField } from "./actions";

type Field = { id: string; field_key: string; label: string; is_core: boolean };

function FieldRow({ field, index, total }: { field: Field; index: number; total: number }) {
  const [label, setLabel] = useState(field.label);
  const [saving, setSaving] = useState(false);

  return (
    <li className="flex items-center justify-between gap-2 rounded-lg bg-base-bg px-3 py-1.5">
      <div className="flex flex-1 items-center gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={async () => {
            if (label.trim() === field.label || !label.trim()) return;
            setSaving(true);
            await updateFieldLabel(field.id, label);
            setSaving(false);
          }}
          className="flex-1 rounded-md border border-base-line bg-base-panel px-2 py-1 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green"
        />
        <code className="text-xs text-base-slate">{field.field_key}</code>
        {field.is_core && <span className="rounded-full bg-base-line px-2 py-0.5 text-[11px] font-medium text-base-slate">Core</span>}
        {saving && <span className="text-[11px] text-brand-green-ink">Saved</span>}
      </div>
      <span className="flex items-center gap-1">
        <button type="button" disabled={index === 0} onClick={() => moveField(field.id, "up")} className="px-1.5 text-base-slate disabled:opacity-30">↑</button>
        <button type="button" disabled={index === total - 1} onClick={() => moveField(field.id, "down")} className="px-1.5 text-base-slate disabled:opacity-30">↓</button>
        {!field.is_core && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete the "${field.label}" field and all its options?`)) removeField(field.id);
            }}
            className="ml-1 text-xs font-semibold text-status-critical"
          >
            Delete
          </button>
        )}
      </span>
    </li>
  );
}

export default function FieldsManager({ fields }: { fields: Field[] }) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-base-line bg-base-panel p-5">
      <h2 className="text-lg font-semibold text-base-ink">Fields</h2>
      <p className="mt-1 text-sm text-base-slate">
        The 6 core fields are always required by the site and can&apos;t be removed — you can still relabel them.
        Add your own dropdown field below; it appears as an extra, optional question on the public form.
      </p>
      <ul className="mt-4 space-y-1.5">
        {fields.map((f, i) => (
          <FieldRow key={f.id} field={f} index={i} total={fields.length} />
        ))}
      </ul>
      <form
        className="mt-4 flex flex-wrap gap-2"
        action={async () => {
          setError(null);
          setPending(true);
          try {
            await addField(key, label);
            setKey("");
            setLabel("");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Couldn't add that field.");
          }
          setPending(false);
        }}
      >
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="field_key (e.g. roof_type)"
          className="w-56 rounded-lg border border-base-line bg-base-bg px-3 py-1.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label shown to visitors"
          className="flex-1 rounded-lg border border-base-line bg-base-bg px-3 py-1.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
        />
        <button disabled={pending || !key.trim() || !label.trim()} className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
          Add field
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-status-critical">{error}</p>}
    </div>
  );
}
