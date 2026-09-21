"use client";

import { useEffect, useState } from "react";
import { addField, updateFieldLabel, removeField, moveField, addOption, updateOption, removeOption, type LeadFormPage } from "./actions";

type Field = { id: string; field_key: string; label: string; is_core: boolean };
type Option = { id: string; field_name: string; value: string };

const buttonBase = "rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150";

/** Small backdrop + centered panel — no library, this is the only place the
 * CMS needs a modal so it isn't worth a dependency for it. */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-base-line bg-base-panel shadow-lg"
      >
        <div className="flex items-center justify-between border-b border-base-line px-5 py-4">
          <h3 className="text-sm font-semibold text-base-ink">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-base-slate hover:text-base-ink">
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/** One option's value inside the edit modal — click to edit in place, or delete. */
function OptionRow({ page, option }: { page: LeadFormPage; option: Option }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(option.value);
  const [busy, setBusy] = useState(false);

  return (
    <li className="flex items-center justify-between gap-2 rounded-lg bg-base-bg px-3 py-2">
      {editing ? (
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
              await updateOption(page, option.id, trimmed);
            } catch {
              setValue(option.value);
            } finally {
              setBusy(false);
            }
          }}
          className="flex-1 rounded-md border border-brand-green bg-base-panel px-2 py-1 text-sm text-base-ink outline-none focus:ring-1 focus:ring-brand-green"
        />
      ) : (
        <span className={`text-sm text-base-ink ${busy ? "opacity-40" : ""}`}>{value}</span>
      )}
      <span className="flex shrink-0 items-center gap-1.5">
        <button type="button" disabled={busy || editing} onClick={() => setEditing(true)} className="text-xs font-semibold text-base-slate hover:text-brand-green-ink">
          Edit
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await removeOption(page, option.id);
            } catch {
              setBusy(false);
            }
          }}
          className="text-xs font-semibold text-status-critical hover:underline"
        >
          Delete
        </button>
      </span>
    </li>
  );
}

/** Add/Edit modal for one field: label, its full list of current selections
 * (each independently editable/removable), and a form to add a new one. */
function FieldModal({ page, field, options, onClose }: { page: LeadFormPage; field: Field | null; options: Option[]; onClose: () => void }) {
  const isCreate = field === null;
  const [key, setKey] = useState("");
  const [label, setLabel] = useState(field?.label ?? "");
  const [newOption, setNewOption] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Modal title={isCreate ? "Add field" : `Edit "${field.label}"`} onClose={onClose}>
      {isCreate ? (
        <form
          className="flex flex-col gap-3"
          action={async () => {
            setError(null);
            setPending(true);
            try {
              await addField(page, key, label);
              onClose();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Couldn't add that field.");
            } finally {
              setPending(false);
            }
          }}
        >
          <label className="text-xs font-medium text-base-slate">
            Field key
            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="e.g. roof_type"
              className="mt-1 w-full rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
            />
          </label>
          <label className="text-xs font-medium text-base-slate">
            Label shown to visitors
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Roof type"
              className="mt-1 w-full rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
            />
          </label>
          {error && <p className="text-xs text-status-critical">{error}</p>}
          <div className="mt-1 flex justify-end gap-2">
            <button type="button" onClick={onClose} className={`${buttonBase} border border-base-line text-base-ink hover:border-base-slate`}>
              Cancel
            </button>
            <button disabled={pending || !key.trim() || !label.trim()} className={`${buttonBase} bg-brand-green text-white disabled:opacity-50`}>
              Add field
            </button>
          </div>
        </form>
      ) : (
        <>
          <label className="text-xs font-medium text-base-slate">
            Label shown to visitors
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={async () => {
                const trimmed = label.trim();
                if (!trimmed || trimmed === field.label) {
                  setLabel(field.label);
                  return;
                }
                await updateFieldLabel(page, field.id, trimmed);
              }}
              className="mt-1 w-full rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
            />
          </label>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-base-slate">Current selections</p>
          <ul className="mt-2 flex max-h-64 flex-col gap-1.5 overflow-y-auto">
            {options.map((o) => (
              <OptionRow key={o.id} page={page} option={o} />
            ))}
            {!options.length && <li className="text-sm text-base-slate">No options yet — add one below.</li>}
          </ul>

          <form
            className="mt-3 flex gap-2"
            action={async () => {
              if (!newOption.trim()) return;
              setPending(true);
              try {
                await addOption(page, field.field_key, newOption);
                setNewOption("");
              } finally {
                setPending(false);
              }
            }}
          >
            <input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Add a selection…"
              className="flex-1 rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green"
            />
            <button disabled={pending || !newOption.trim()} className={`${buttonBase} bg-brand-green text-white disabled:opacity-50`}>
              Add
            </button>
          </form>

          <div className="mt-5 flex justify-end">
            <button type="button" onClick={onClose} className={`${buttonBase} border border-base-line text-base-ink hover:border-base-slate`}>
              Done
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

function FieldTableRow({ page, field, options, index, total, onEdit }: { page: LeadFormPage; field: Field; options: Option[]; index: number; total: number; onEdit: () => void }) {
  const preview = options.map((o) => o.value);
  const shown = preview.slice(0, 4).join(", ");
  const extra = preview.length - 4;

  return (
    <tr>
      <td className="w-14 py-4 pl-6 pr-2">
        <div className="flex flex-col items-center gap-0.5">
          <button type="button" disabled={index === 0} onClick={() => moveField(page, field.id, "up")} className="text-base-slate hover:text-brand-green-ink disabled:opacity-25">▲</button>
          <button type="button" disabled={index === total - 1} onClick={() => moveField(page, field.id, "down")} className="text-base-slate hover:text-brand-green-ink disabled:opacity-25">▼</button>
        </div>
      </td>
      <td className="w-56 py-4 pr-4">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-base-ink">{field.label}</span>
          {field.is_core && <span className="rounded-full bg-base-line px-1.5 py-0.5 text-[10px] font-medium text-base-slate">Core</span>}
        </div>
        <code className="text-[11px] text-base-slate">{field.field_key}</code>
      </td>
      <td className="py-4 pr-4">
        {preview.length ? (
          <span className="text-sm text-base-slate">
            {shown}
            {extra > 0 && <span className="text-base-slate/70"> +{extra} more</span>}
          </span>
        ) : (
          <span className="text-sm italic text-base-slate">No options yet</span>
        )}
      </td>
      <td className="w-40 py-4 pr-6 text-right">
        <div className="inline-flex items-center gap-2">
          <button type="button" onClick={onEdit} className={`${buttonBase} border border-base-line bg-base-bg text-base-ink hover:border-base-slate`}>
            Edit
          </button>
          {!field.is_core && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete the "${field.label}" field and all its options?`)) removeField(page, field.id);
              }}
              className={`${buttonBase} border border-status-critical/30 bg-status-critical/10 text-status-critical hover:bg-status-critical/15`}
            >
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function LeadFormTable({ page, fields, options }: { page: LeadFormPage; fields: Field[]; options: Option[] }) {
  const [modal, setModal] = useState<"create" | { fieldId: string } | null>(null);
  const editingField = modal && modal !== "create" ? fields.find((f) => f.id === modal.fieldId) ?? null : null;

  return (
    <div className="admin-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-base-line px-6 py-4">
        <div>
          <h2 className="text-sm font-semibold text-base-ink">All fields</h2>
          <p className="mt-1 text-xs text-base-slate">Every field and its current dropdown selections on the public form.</p>
        </div>
        <button type="button" onClick={() => setModal("create")} className={`${buttonBase} bg-brand-green text-white`}>
          + Add field
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-base-line bg-base-bg text-[11px] font-medium uppercase tracking-wide text-base-slate">
            <tr>
              <th className="py-3 pl-6 pr-2 font-medium">Order</th>
              <th className="py-3 pr-4 font-medium">Field</th>
              <th className="py-3 pr-4 font-medium">Current selections</th>
              <th className="py-3 pr-6 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-line">
            {fields.map((f, i) => (
              <FieldTableRow
                key={f.id}
                page={page}
                field={f}
                index={i}
                total={fields.length}
                options={options.filter((o) => o.field_name === f.field_key)}
                onEdit={() => setModal({ fieldId: f.id })}
              />
            ))}
          </tbody>
        </table>
      </div>

      {modal === "create" && <FieldModal page={page} field={null} options={[]} onClose={() => setModal(null)} />}
      {editingField && (
        <FieldModal
          page={page}
          field={editingField}
          options={options.filter((o) => o.field_name === editingField.field_key)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
