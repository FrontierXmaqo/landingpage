"use client";

import { CLEAN, type Contact } from "@/lib/siteContent";
import { saveSection } from "../site-content/actions";
import { SaveStatus, inputClass, labelClass, useAutosave } from "../editorUi";

const FIELDS: { key: keyof Contact; label: string; hint?: string; multiline?: boolean }[] = [
  { key: "address", label: "Office address", multiline: true },
  { key: "mapsHref", label: "Google Maps link" },
  { key: "office", label: "Office phone (as shown)" },
  { key: "officeTel", label: "Dial as", hint: "The number phones call: country code, no spaces, e.g. +60380691706." },
  { key: "email", label: "Email" },
];

export default function ContactEditor({ initial }: { initial: Contact }) {
  const { data, update, state, error } = useAutosave(initial, CLEAN.contact, (d) => saveSection("contact", d));

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <div className="admin-card space-y-4 p-5">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className={labelClass}>{f.label}</span>
            {f.multiline ? (
              <textarea rows={2} value={data[f.key]} onChange={(e) => update({ ...data, [f.key]: e.target.value })} className={`mt-1 ${inputClass}`} />
            ) : (
              <input value={data[f.key]} onChange={(e) => update({ ...data, [f.key]: e.target.value })} className={`mt-1 ${inputClass}`} />
            )}
            {f.hint && <span className="mt-1 block text-xs text-base-slate">{f.hint}</span>}
          </label>
        ))}
        <SaveStatus state={state} error={error} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-base-slate">Preview of the /contact cards</p>
        <div className="mt-2 space-y-3">
          {[
            ["Office", data.address, "Open in Google Maps"],
            ["Phone", data.office, "Call us"],
            ["Email", data.email, "Send an email"],
          ].map(([label, value, action]) => (
            <div key={label} className="rounded-[22px] border border-base-line bg-base-panel p-5">
              <p className="text-sm font-semibold text-base-slate">{label}</p>
              <p className="mt-1 text-base font-bold text-base-ink [overflow-wrap:anywhere]">{value || <span className="text-status-critical">Missing</span>}</p>
              <p className="mt-3 text-sm font-semibold text-brand-green-ink">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
