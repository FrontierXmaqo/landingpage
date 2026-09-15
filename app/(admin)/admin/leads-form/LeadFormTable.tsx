"use client";

import { useState } from "react";
import { addField, updateFieldLabel, removeField, moveField, addOption, updateOption, removeOption } from "./actions";

type Field = { id: string; field_key: string; label: string; is_core: boolean };
type Option = { id: string; field_name: string; value: string };

function OptionChip({ option }: { option: Option }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(option.value);
  const [busy, setBusy] = useState(false);

  if (editing) {
    return (
      <span className="inline-flex items-center rounded-full border border-brand-green bg-base-panel py-1 pl-3 pr-1.5">
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") {
              setValue(option.value);
              setEditing(false);
            }
          }}
          onBlur={async () => {
            setEditing(false);
            const trimmed = value.trim();
            if (!trimmed || trimmed === option.value) {
              setValue(option.value);
              return;
            }
            setBusy(true);
            try {
              await updateOption(option.id, trimmed);
            } catch {
              setValue(option.value);
            } finally {
              setBusy(false);
            }
          }}
          className="w-28 bg-transparent text-xs text-base-ink outline-none"
        />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-base-line bg-base-bg py-1 pl-1 pr-1.5 text-xs text-base-ink transition-opacity ${busy ? "opacity-40" : ""}`}
    >
      <button
        type="button"
        title="Click to edit"
        disabled={busy}
        onClick={() => setEditing(true)}
        className="rounded-full px-2 py-0.5 hover:bg-base-line"
      >
        {value}
      </button>
      <button
        type="button"
        aria-label={`Remove ${option.value}`}
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await removeOption(option.id);
          } catch {
            setBusy(false);
          }
        }}
        className="flex h-4 w-4 items-center justify-center rounded-full text-base-slate hover:bg-base-line hover:text-status-critical"
      >
        ×
      </button>
    </span>
  );
}

function AddOptionChip({ fieldKey }: { fieldKey: string }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-full border border-dashed border-base-line px-3 py-1 text-xs font-medium text-base-slate hover:border-brand-green hover:text-brand-green-ink"
      >
        + Add option
      </button>
    );
  }

  return (
    <form
      className="inline-flex items-center gap-1"
      action={async () => {
        if (!value.trim()) return setOpen(false);
        setPending(true);
        try {
          await addOption(fieldKey, value);
          setValue("");
          setOpen(false);
        } finally {
          setPending(false);
        }
      }}
    >
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          // Let the submit button's click register before we collapse the input.
          if (!e.relatedTarget) setTimeout(() => setOpen(false), 150);
        }}
        placeholder="New option…"
        className="w-32 rounded-full border border-brand-green bg-base-panel px-3 py-1 text-xs text-base-ink outline-none focus:ring-2 focus:ring-brand-green"
      />
      <button disabled={pending} className="rounded-full bg-brand-green px-2.5 py-1 text-xs font-semibold text-white disabled:opacity-50">
        Add
      </button>
    </form>
  );
}

function FieldRow({ field, options, index, total }: { field: Field; options: Option[]; index: number; total: number }) {
  const [label, setLabel] = useState(field.label);
  const [savingLabel, setSavingLabel] = useState(false);

  return (
    <tr className="align-top">
      <td className="w-16 py-4 pl-6 pr-2">
        <div className="flex flex-col items-center gap-0.5">
          <button type="button" disabled={index === 0} onClick={() => moveField(field.id, "up")} className="text-base-slate hover:text-brand-green-ink disabled:opacity-25">▲</button>
          <button type="button" disabled={index === total - 1} onClick={() => moveField(field.id, "down")} className="text-base-slate hover:text-brand-green-ink disabled:opacity-25">▼</button>
        </div>
      </td>
      <td className="w-64 py-4 pr-4">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={async () => {
            if (!label.trim() || label.trim() === field.label) return;
            setSavingLabel(true);
            try {
              await updateFieldLabel(field.id, label);
            } catch {
              setLabel(field.label);
            } finally {
              setSavingLabel(false);
            }
          }}
          className="w-full rounded-md border border-transparent bg-transparent px-1.5 py-1 text-sm font-medium text-base-ink outline-none hover:border-base-line focus:border-brand-green focus:bg-base-bg focus:ring-1 focus:ring-brand-green"
        />
        <div className="mt-1 flex items-center gap-1.5 pl-1.5">
          <code className="text-[11px] text-base-slate">{field.field_key}</code>
          {field.is_core && <span className="rounded-full bg-base-line px-1.5 py-0.5 text-[10px] font-medium text-base-slate">Core</span>}
          {savingLabel && <span className="text-[11px] text-brand-green-ink">Saving…</span>}
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {options.map((o) => (
            <OptionChip key={o.id} option={o} />
          ))}
          {!options.length && <span className="text-xs text-base-slate">No options yet.</span>}
          <AddOptionChip fieldKey={field.field_key} />
        </div>
      </td>
      <td className="w-12 py-4 pr-6 text-right">
        {!field.is_core && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete the "${field.label}" field and all its options?`)) removeField(field.id);
            }}
            aria-label={`Delete ${field.label}`}
            className="text-base-slate hover:text-status-critical"
          >
            🗑
          </button>
        )}
      </td>
    </tr>
  );
}

export default function LeadFormTable({ fields, options }: { fields: Field[]; options: Option[] }) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-base-line bg-base-panel shadow-sm">
      <div className="border-b border-base-line px-6 py-4">
        <h2 className="text-sm font-semibold text-base-ink">Fields &amp; dropdown selections</h2>
        <p className="mt-1 text-xs text-base-slate">
          Every field on the public form, and every option a visitor can pick. Click a field label or an option to
          edit it, add or remove options, reorder, or add a whole new field — it all saves as a draft.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-base-line bg-base-bg text-[11px] font-medium uppercase tracking-wide text-base-slate">
            <tr>
              <th className="py-3 pl-6 pr-2 font-medium">Order</th>
              <th className="py-3 pr-4 font-medium">Field</th>
              <th className="py-3 pr-4 font-medium">Dropdown selections</th>
              <th className="py-3 pr-6 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-line">
            {fields.map((f, i) => (
              <FieldRow
                key={f.id}
                field={f}
                index={i}
                total={fields.length}
                options={options.filter((o) => o.field_name === f.field_key)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <form
        className="flex flex-wrap items-center gap-2 border-t border-base-line bg-base-bg px-6 py-4"
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
        <span className="text-xs font-semibold uppercase tracking-wide text-base-slate">+ New field</span>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="field_key (e.g. roof_type)"
          className="w-52 rounded-lg border border-base-line bg-base-panel px-3 py-1.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label shown to visitors"
          className="flex-1 min-w-[180px] rounded-lg border border-base-line bg-base-panel px-3 py-1.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
        />
        <button disabled={pending || !key.trim() || !label.trim()} className="rounded-lg bg-brand-green px-3.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
          Add field
        </button>
        {error && <p className="w-full text-xs text-status-critical">{error}</p>}
      </form>
    </div>
  );
}
