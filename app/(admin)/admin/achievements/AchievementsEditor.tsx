"use client";

import { useRef, useState, useTransition } from "react";
import { addAchievement, moveAchievement, removeAchievement, updateAchievement } from "./actions";
import { ErrorNote, inputClass, labelClass, useAddedRow } from "../editorUi";

export type AchievementRow = { id: string; value: string; label: string };

function Field({
  label,
  defaultValue,
  onSave,
  placeholder,
}: {
  label: string;
  defaultValue: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const initial = useRef(defaultValue);

  async function commit(value: string) {
    if (value === initial.current) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(value);
      initial.current = value;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save that.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <input
        defaultValue={defaultValue}
        placeholder={placeholder}
        onBlur={(e) => commit(e.target.value)}
        className={`mt-1 ${inputClass} ${saving ? "opacity-50" : ""}`}
      />
      <ErrorNote message={error} />
    </label>
  );
}

function MoveButtons({ id, first, last }: { id: string; first: boolean; last: boolean }) {
  const [pending, startTransition] = useTransition();
  const base = "rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate disabled:opacity-30 hover:border-base-slate";
  return (
    <span className="flex items-center gap-1">
      <button type="button" aria-label="Move up" disabled={first || pending} onClick={() => startTransition(() => moveAchievement(id, "up"))} className={base}>
        ↑
      </button>
      <button type="button" aria-label="Move down" disabled={last || pending} onClick={() => startTransition(() => moveAchievement(id, "down"))} className={base}>
        ↓
      </button>
    </span>
  );
}

export default function AchievementsEditor({ items }: { items: AchievementRow[] }) {
  const [pending, startTransition] = useTransition();
  const [adding, startAdding] = useTransition();
  const [addError, setAddError] = useState<string | null>(null);
  const added = useAddedRow(items.map((i) => i.id), "achievement-");

  return (
    <div className="admin-card p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-base-slate">
          {adding && "Adding…"}
          {!adding && added && <span className="text-brand-green-ink">✓ Added below - fill it in, then Publish.</span>}
        </p>
        <button
          type="button"
          disabled={pending || adding}
          onClick={() => {
            setAddError(null);
            startAdding(async () => {
              try {
                await addAchievement();
              } catch (err) {
                setAddError(err instanceof Error ? err.message : "Could not add that.");
              }
            });
          }}
          className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {adding ? "Adding…" : "Add figure"}
        </button>
      </div>
      <ErrorNote message={addError} />

      {items.length === 0 && <p className="mt-4 text-sm text-base-slate">No figures yet - add one above.</p>}

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item.id}
            id={`achievement-${item.id}`}
            className={`space-y-3 rounded-lg bg-base-bg p-4 ${added === item.id ? "ring-2 ring-brand-green" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-base-slate">#{i + 1}</span>
              <span className="flex items-center gap-2">
                <MoveButtons id={item.id} first={i === 0} last={i === items.length - 1} />
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm("Remove this figure?")) return;
                    startTransition(() => removeAchievement(item.id));
                  }}
                  className="text-xs font-semibold text-base-slate hover:text-status-critical"
                >
                  Remove
                </button>
              </span>
            </div>
            <Field label="Figure" defaultValue={item.value} placeholder="1000+" onSave={(v) => updateAchievement(item.id, "value", v)} />
            <Field label="Label" defaultValue={item.label} placeholder="Residential Solar Projects Done" onSave={(v) => updateAchievement(item.id, "label", v)} />
          </div>
        ))}
      </div>
    </div>
  );
}
