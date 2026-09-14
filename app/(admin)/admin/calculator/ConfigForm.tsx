"use client";

import { useState } from "react";
import { saveConfigDraft } from "./actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green";

export default function ConfigForm({ config }: { config: Record<string, unknown> }) {
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        await saveConfigDraft(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-base-line bg-base-panel p-6 sm:grid-cols-3"
    >
      <label className="text-sm font-medium text-base-ink">
        Tariff tier threshold (kWh)
        <input name="tariff_tier_threshold_kwh" type="number" step="any" defaultValue={String(config.tariff_tier_threshold_kwh)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Tariff below threshold (RM/kWh)
        <input name="tariff_below_threshold_per_kwh" type="number" step="any" defaultValue={String(config.tariff_below_threshold_per_kwh)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Tariff above threshold (RM/kWh)
        <input name="tariff_above_threshold_per_kwh" type="number" step="any" defaultValue={String(config.tariff_above_threshold_per_kwh)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        SURIA rebate (RM/kWac)
        <input name="suria_rebate_per_kwac" type="number" step="any" defaultValue={String(config.suria_rebate_per_kwac)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        SURIA rebate cap (RM)
        <input name="suria_rebate_cap" type="number" step="any" defaultValue={String(config.suria_rebate_cap)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Anniversary rebate (RM flat)
        <input name="anniversary_rebate_flat" type="number" step="any" defaultValue={String(config.anniversary_rebate_flat)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink sm:col-span-3">
        Anniversary rebate valid until
        <input name="anniversary_rebate_valid_until" defaultValue={String(config.anniversary_rebate_valid_until ?? "")} className={fieldClass} />
      </label>

      <div className="sm:col-span-3 flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-transform duration-100 active:scale-[0.98]"
        >
          Save draft
        </button>
        {saved && <span className="animate-fade-in-up text-sm text-brand-green-ink">Saved.</span>}
      </div>
    </form>
  );
}
