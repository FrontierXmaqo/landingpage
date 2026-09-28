"use client";

import { CLEAN, type Service } from "@/lib/siteContent";
import { saveSection } from "../site-content/actions";
import { SaveStatus, inputClass, labelClass, useAutosave } from "../editorUi";

const small = "rounded-md border border-base-line px-2 py-1 text-xs font-semibold text-base-slate disabled:opacity-30 hover:border-base-slate";

export default function ServicesEditor({ initial }: { initial: Service[] }) {
  const { data, update, state, error } = useAutosave(initial, CLEAN.services, (d) => saveSection("services", d));
  const set = (i: number, p: Partial<Service>) => update(data.map((s, j) => (j === i ? { ...s, ...p } : s)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...data];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    update(next);
  };

  return (
    <div className="admin-card p-5">
      <SaveStatus state={state} error={error} />
      <div className="mt-2 space-y-3">
        {data.map((s, i) => (
          <div key={i} className="rounded-lg bg-base-bg p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-base-slate">Service {i + 1}</span>
              <span className="flex items-center gap-1">
                <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className={small}>↑</button>
                <button type="button" aria-label="Move down" disabled={i === data.length - 1} onClick={() => move(i, 1)} className={small}>↓</button>
                <button type="button" onClick={() => update(data.filter((_, j) => j !== i))} className="px-1 text-xs font-semibold text-base-slate hover:text-status-critical">
                  Remove
                </button>
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_2fr]">
              <label className="block">
                <span className={labelClass}>Title</span>
                <input value={s.title} onChange={(e) => set(i, { title: e.target.value })} className={`mt-1 ${inputClass}`} />
              </label>
              <label className="block">
                <span className={labelClass}>Description</span>
                <input value={s.body} onChange={(e) => set(i, { body: e.target.value })} className={`mt-1 ${inputClass}`} />
              </label>
            </div>
          </div>
        ))}
      </div>
      {data.length < 12 && (
        <button
          type="button"
          onClick={() => update([...data, { title: "New service", body: "" }])}
          className="mt-3 rounded-lg border border-dashed border-base-line px-3 py-1.5 text-xs font-semibold text-brand-green-ink hover:border-brand-green"
        >
          + Add service
        </button>
      )}
    </div>
  );
}
