"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";
import { trackOnce, trackEvent } from "@/lib/track";
import {
  SOLAR_CALC_CONFIG,
  SOLAR_PACKAGES_HYBRID,
  SOLAR_PACKAGES_NEO,
  type SolarPackage,
} from "@/lib/content";
import { fill, type Dictionary } from "@/lib/i18n";

type CalculatorConfig = typeof SOLAR_CALC_CONFIG;

function formatRM(value: number) {
  return `RM${Math.round(value).toLocaleString("en-US")}`;
}

type StorageOption = "neo" | "hybrid";

const STORAGE_OPTIONS: StorageOption[] = ["neo", "hybrid"];

export default function SolarCalculator({
  t,
  config = SOLAR_CALC_CONFIG,
  packagesHybrid = SOLAR_PACKAGES_HYBRID,
  packagesNeo = SOLAR_PACKAGES_NEO,
}: {
  t: Dictionary["calculator"];
  config?: CalculatorConfig;
  packagesHybrid?: SolarPackage[];
  packagesNeo?: SolarPackage[];
}) {
  const [billInput, setBillInput] = useState("650");
  const [storageOption, setStorageOption] = useState<StorageOption>("neo");

  const bill = parseFloat(billInput) || 0;

  const result = useMemo(() => {
    if (bill <= 0) return null;

    const { tariffTierThresholdKwh, tariffBelowThresholdPerKwh, tariffAboveThresholdPerKwh } =
      config;

    let consumptionKwh = bill / tariffBelowThresholdPerKwh;
    let isAboveThreshold = false;
    if (consumptionKwh >= tariffTierThresholdKwh) {
      consumptionKwh = bill / tariffAboveThresholdPerKwh;
      isAboveThreshold = true;
    }

    const packages = storageOption === "neo" ? packagesNeo : packagesHybrid;
    const sorted = [...packages].sort((a, b) => a.kwp - b.kwp);
    const largest = sorted[sorted.length - 1];
    const exceedsLargestPackage = consumptionKwh > largest.monthlyGenerationKwh;
    const selected =
      sorted.find((pkg) => pkg.monthlyGenerationKwh >= consumptionKwh) ?? largest;

    const monthlySavings = isAboveThreshold
      ? selected.monthlySavingsAboveThreshold
      : selected.monthlySavingsBelowThreshold;

    return {
      consumptionKwh,
      selected,
      monthlySavings,
      savings10yr: monthlySavings * 12 * 10,
      savings30yr: monthlySavings * 12 * 30,
      exceedsLargestPackage,
    };
  }, [bill, storageOption, config, packagesHybrid, packagesNeo]);

  // Fires once per session, only after the visitor has actually changed the bill
  // (billInput starts pre-filled, so a result on first render isn't real usage).
  const hasResult = Boolean(result);
  useEffect(() => {
    if (hasResult && billInput !== "650") trackEvent("calculator_complete");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasResult]);

  return (
    <section id="packages" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow={t.eyebrow}
        title={t.title}
        body={t.body}
      />

      <div className="mt-10 rounded-3xl bg-brand-orange p-[1.5px] shadow-lg shadow-brand-orange/25">
        <div className="overflow-hidden rounded-[calc(1.5rem-1.5px)] border border-base-line bg-base-panel">
        <div className="grid grid-cols-1 gap-6 border-b border-base-line bg-base-bg p-6 sm:grid-cols-2 sm:p-8">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-base-ink">
            {t.billLabel}
            <div className="flex items-center gap-2 rounded-lg border border-base-line bg-base-panel px-3 py-2.5 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green">
              <span className="text-sm font-semibold text-base-slate">RM</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={billInput}
                onChange={(e) => {
                  setBillInput(e.target.value);
                  trackOnce("calculator_start");
                }}
                placeholder="650"
                className="w-full text-sm text-base-ink outline-none placeholder:text-base-slate"
              />
              <span className="whitespace-nowrap text-xs text-base-slate">{t.perMonthSuffix}</span>
            </div>
            <span className="text-xs font-normal text-base-slate">
              {t.billHint}
            </span>
          </label>

          <div className="flex flex-col gap-1.5 text-sm font-medium text-base-ink">
            {t.systemTypeLabel}
            <div className="grid grid-cols-2 gap-2">
              {STORAGE_OPTIONS.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStorageOption(value)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition ${
                    storageOption === value
                      ? "border-brand-green bg-brand-green-tint text-brand-green-ink"
                      : "border-base-line bg-base-panel text-base-slate hover:border-base-slate"
                  }`}
                >
                  <span className="block text-sm">{t.options[value].label}</span>
                  <span className="mt-0.5 block font-normal text-base-slate">{t.options[value].hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {result ? (
          <div className="p-6 sm:p-8">
            <p className="section-eyebrow text-xs font-semibold uppercase text-brand-green-ink">
              {t.resultEyebrow}
            </p>
            <h3 className="mt-1 text-xl font-bold text-base-ink">
              {fill(t.resultTitle, { bill: formatRM(bill) })}
            </h3>
            <p className="mt-1 text-sm text-base-slate">
              {fill(t.resultBody, {
                kwh: Math.round(result.consumptionKwh).toLocaleString("en-US"),
                kwp: result.selected.kwp.toFixed(1),
              })}
            </p>

            {result.exceedsLargestPackage && (
              <p className="mt-3 rounded-lg bg-brand-orange-tint px-3 py-2 text-xs text-brand-orange-ink">
                {t.exceedsLargest}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-base-line bg-base-bg p-5 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-tint text-brand-green-ink">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
                      <circle cx="12" cy="12" r="4" />
                      <path
                        strokeLinecap="round"
                        d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                      />
                    </svg>
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase text-base-slate">
                    {t.systemSizeLabel}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-base-ink">
                    {result.selected.kwp.toFixed(1)} kWp
                  </p>
                </div>

                <div className="rounded-2xl border border-base-line bg-base-bg p-5 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-green-tint text-brand-green-ink">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
                      <rect x="3" y="4" width="18" height="12" rx="1.5" />
                      <path strokeLinecap="round" d="M3 10h18M9 4v12M15 4v12M8 20h8" />
                    </svg>
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase text-base-slate">
                    {t.panelsLabel}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-base-ink">
                    {fill(t.panelsValue, { count: result.selected.panels })}
                  </p>
                </div>
              </div>

              {/* The one wow.magenta on the page: the visitor's own savings figure is the
                  number the whole landing page exists to produce. Flat fill, because
                  gradients are not allowed behind data. */}
              <div className="rounded-2xl border border-wow-magenta bg-wow-magenta-tint p-6 text-center sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-base-slate">
                  {t.monthlySavingsLabel}
                </p>
                <p className="mt-2 text-5xl font-extrabold leading-none text-wow-magenta-ink">
                  {formatRM(result.monthlySavings)}
                </p>
                <p className="mt-1 text-xs font-medium text-base-slate">{t.perMonth}</p>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-wow-magenta/25 pt-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">
                      {t.over10Years}
                    </p>
                    <p className="mt-1 text-xl font-bold text-base-ink">
                      {formatRM(result.savings10yr)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">
                      {t.over30Years}
                    </p>
                    <p className="mt-1 text-xl font-bold text-base-ink">
                      {formatRM(result.savings30yr)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#assessment"
              className="mt-8 flex items-center justify-center gap-2 rounded-full bg-brand-orange-deep px-8 py-5 text-base font-bold text-white transition-all duration-150 ease-out shadow-[0_6px_0_0_var(--color-brand-orange-ink)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--color-brand-orange-ink)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-brand-orange-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-base-ink"
            >
              {t.cta}
            </a>

            <p className="mt-4 text-xs leading-relaxed text-base-slate">
              {t.disclaimer}
            </p>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-base-slate">
            {t.empty}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
