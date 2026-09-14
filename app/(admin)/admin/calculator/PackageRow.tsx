"use client";

import { useState } from "react";
import { savePackageDraft, deletePackageDraft, type PackageInput } from "./actions";

const cell = "w-full rounded-md border border-base-line bg-base-bg px-2 py-1.5 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";

type Pkg = Record<string, unknown>;

const EMPTY = {
  sort_order: "0", kwp: "", panels: "", inverter_model: "", kwac: "", standard_selling_price: "",
  monthly_savings_below_threshold: "", monthly_savings_above_threshold: "",
  dc_ac_ratio: "1", monthly_generation_kwh: "0", payback_years_below_threshold: "0", payback_years_above_threshold: "0",
};

/** One editable row (no nested <form> — a <tr>/<td> can't legally contain one). */
export default function PackageRow({ pkg, storageType }: { pkg?: Pkg; storageType: "hybrid" | "neo" }) {
  const initial = pkg
    ? Object.fromEntries(Object.keys(EMPTY).map((k) => [k, String(pkg[k] ?? EMPTY[k as keyof typeof EMPTY])]))
    : EMPTY;
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: e.target.value }));

  async function save() {
    setSaving(true);
    const input: PackageInput = {
      id: pkg ? String(pkg.id) : undefined,
      storage_type: storageType,
      sort_order: Number(values.sort_order) || 0,
      kwp: Number(values.kwp),
      panels: Number(values.panels),
      inverter_model: values.inverter_model,
      kwac: Number(values.kwac),
      dc_ac_ratio: Number(values.dc_ac_ratio) || 1,
      monthly_generation_kwh: Number(values.monthly_generation_kwh) || 0,
      standard_selling_price: Number(values.standard_selling_price),
      monthly_savings_below_threshold: Number(values.monthly_savings_below_threshold),
      monthly_savings_above_threshold: Number(values.monthly_savings_above_threshold),
      payback_years_below_threshold: Number(values.payback_years_below_threshold) || 0,
      payback_years_above_threshold: Number(values.payback_years_above_threshold) || 0,
    };
    await savePackageDraft(input);
    setSaving(false);
    if (!pkg) setValues(EMPTY);
  }

  return (
    <tr className="border-b border-base-line last:border-0">
      <td className="p-1.5"><input value={values.sort_order} onChange={set("sort_order")} type="number" className={`${cell} w-16`} /></td>
      <td className="p-1.5"><input value={values.kwp} onChange={set("kwp")} type="number" step="any" className={`${cell} w-20`} /></td>
      <td className="p-1.5"><input value={values.panels} onChange={set("panels")} type="number" className={`${cell} w-16`} /></td>
      <td className="p-1.5"><input value={values.inverter_model} onChange={set("inverter_model")} className={`${cell} min-w-[180px]`} /></td>
      <td className="p-1.5"><input value={values.kwac} onChange={set("kwac")} type="number" step="any" className={`${cell} w-20`} /></td>
      <td className="p-1.5"><input value={values.standard_selling_price} onChange={set("standard_selling_price")} type="number" step="any" className={`${cell} w-24`} /></td>
      <td className="p-1.5"><input value={values.monthly_savings_below_threshold} onChange={set("monthly_savings_below_threshold")} type="number" step="any" className={`${cell} w-24`} /></td>
      <td className="p-1.5"><input value={values.monthly_savings_above_threshold} onChange={set("monthly_savings_above_threshold")} type="number" step="any" className={`${cell} w-24`} /></td>
      <td className="p-1.5 whitespace-nowrap">
        <button
          type="button"
          disabled={saving || !values.kwp || !values.panels || !values.inverter_model}
          onClick={save}
          className="rounded-md bg-brand-green px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {pkg ? "Save" : "Add"}
        </button>
        {pkg && (
          <button
            type="button"
            onClick={() => deletePackageDraft(String(pkg.id))}
            className="ml-1.5 rounded-md border border-status-critical px-2.5 py-1.5 text-xs font-semibold text-status-critical"
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
}
