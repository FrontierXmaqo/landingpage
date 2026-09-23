"use client";

import { useState } from "react";
import { saveEvConfigDraft } from "./actions";

const fieldClass =
  "mt-1 w-full rounded-lg border border-base-line bg-base-bg px-3 py-2 text-sm text-base-ink outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green";

export default function ConfigForm({ config }: { config: Record<string, unknown> }) {
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        await saveEvConfigDraft(formData);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }}
      className="mt-6 grid grid-cols-1 gap-4 rounded-xl border border-base-line bg-base-panel p-6 sm:grid-cols-3"
    >
      <label className="text-sm font-medium text-base-ink">
        Tariff (RM/kWh)
        <input name="rate_per_kwh" type="number" step="any" defaultValue={String(config.rate_per_kwh)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Reference generation (kWh/month)
        <input name="avg_kwh_per_kwp_month" type="number" step="any" defaultValue={String(config.avg_kwh_per_kwp_month)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Reference system size (kWp)
        <input name="reference_system_kwp" type="number" step="any" defaultValue={String(config.reference_system_kwp)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        kWp per panel
        <input name="kwp_per_panel" type="number" step="any" defaultValue={String(config.kwp_per_panel)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Minimum system size (kWp)
        <input name="min_system_kwp" type="number" step="any" defaultValue={String(config.min_system_kwp)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Minimum monthly bill after solar (RM)
        <input name="min_monthly_bill" type="number" step="any" defaultValue={String(config.min_monthly_bill)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Offset - mostly daytime charging (%)
        <input name="offset_day_percent" type="number" step="any" defaultValue={String(config.offset_day_percent)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Offset - mostly nighttime charging (%)
        <input name="offset_night_percent" type="number" step="any" defaultValue={String(config.offset_night_percent)} className={fieldClass} />
      </label>
      <label className="text-sm font-medium text-base-ink">
        Offset - mixed charging (%)
        <input name="offset_mixed_percent" type="number" step="any" defaultValue={String(config.offset_mixed_percent)} className={fieldClass} />
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
