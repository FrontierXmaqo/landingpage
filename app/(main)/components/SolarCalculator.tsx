"use client";

import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";
import {
  SOLAR_CALC_CONFIG,
  SOLAR_PACKAGES_HYBRID,
  SOLAR_PACKAGES_NEO,
} from "@/lib/content";

function formatRM(value: number) {
  return `RM${Math.round(value).toLocaleString("en-US")}`;
}

type StorageOption = "neo" | "hybrid";

const STORAGE_OPTIONS: { value: StorageOption; label: string; hint: string }[] = [
  { value: "neo", label: "With Battery Storage", hint: "Solar panels plus home battery" },
  { value: "hybrid", label: "Without Battery Storage", hint: "Solar panels only" },
];

export default function SolarCalculator() {
  const [billInput, setBillInput] = useState("650");
  const [storageOption, setStorageOption] = useState<StorageOption>("neo");

  const bill = parseFloat(billInput) || 0;

  const result = useMemo(() => {
    if (bill <= 0) return null;

    const { tariffTierThresholdKwh, tariffBelowThresholdPerKwh, tariffAboveThresholdPerKwh } =
      SOLAR_CALC_CONFIG;

    let consumptionKwh = bill / tariffBelowThresholdPerKwh;
    let isAboveThreshold = false;
    if (consumptionKwh >= tariffTierThresholdKwh) {
      consumptionKwh = bill / tariffAboveThresholdPerKwh;
      isAboveThreshold = true;
    }

    const packages = storageOption === "neo" ? SOLAR_PACKAGES_NEO : SOLAR_PACKAGES_HYBRID;
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
  }, [bill, storageOption]);

  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Solar Calculator"
        title="See how much you could save with solar"
        body="Enter your average monthly TNB bill and choose whether you want battery storage, and we'll match you to a package and estimate the system size, savings, and final price after rebates."
      />

      <div className="mt-10 rounded-3xl bg-brand-orange p-[1.5px] shadow-lg shadow-brand-orange/25">
        <div className="overflow-hidden rounded-[calc(1.5rem-1.5px)] border border-base-line bg-base-panel">
        <div className="grid grid-cols-1 gap-6 border-b border-base-line bg-base-bg p-6 sm:grid-cols-2 sm:p-8">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-base-ink">
            Average Monthly TNB Bill
            <div className="flex items-center gap-2 rounded-lg border border-base-line bg-base-panel px-3 py-2.5 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green">
              <span className="text-sm font-semibold text-base-slate">RM</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={billInput}
                onChange={(e) => setBillInput(e.target.value)}
                placeholder="650"
                className="w-full text-sm text-base-ink outline-none placeholder:text-base-slate"
              />
              <span className="whitespace-nowrap text-xs text-base-slate">/ month</span>
            </div>
            <span className="text-xs font-normal text-base-slate">
              You can find this amount on your latest TNB bill.
            </span>
          </label>

          <div className="flex flex-col gap-1.5 text-sm font-medium text-base-ink">
            System Type
            <div className="grid grid-cols-2 gap-2">
              {STORAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStorageOption(opt.value)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition ${
                    storageOption === opt.value
                      ? "border-brand-green bg-brand-green-tint text-brand-green-ink"
                      : "border-base-line bg-base-panel text-base-slate hover:border-base-slate"
                  }`}
                >
                  <span className="block text-sm">{opt.label}</span>
                  <span className="mt-0.5 block font-normal text-base-slate">{opt.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {result ? (
          <div className="p-6 sm:p-8">
            <p className="section-eyebrow text-xs font-semibold uppercase text-brand-green-ink">
              Your solar estimate
            </p>
            <h3 className="mt-1 text-xl font-bold text-base-ink">
              Based on your TNB bill of {formatRM(bill)}/month
            </h3>
            <p className="mt-1 text-sm text-base-slate">
              Estimated for an average monthly usage of about{" "}
              {Math.round(result.consumptionKwh).toLocaleString("en-US")} kWh, sized to a{" "}
              {result.selected.kwp.toFixed(1)} kWp system.
            </p>

            {result.exceedsLargestPackage && (
              <p className="mt-3 rounded-lg bg-brand-orange-tint px-3 py-2 text-xs text-brand-orange-ink">
                Your usage is higher than our largest standard package can fully offset, so the
                estimate below is based on that package. Our team can design a larger custom
                system for you.
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
                    Recommended System Size
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
                    Estimated Number of Panels
                  </p>
                  <p className="mt-1 text-2xl font-bold text-base-ink">
                    {result.selected.panels} panels
                  </p>
                </div>
              </div>

              {/* The one wow.magenta on the page: the visitor's own savings figure is the
                  number the whole landing page exists to produce. Flat fill, because
                  gradients are not allowed behind data. */}
              <div className="rounded-2xl border border-wow-magenta bg-wow-magenta-tint p-6 text-center sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wide text-base-slate">
                  Estimated Monthly Savings
                </p>
                <p className="mt-2 text-5xl font-extrabold leading-none text-wow-magenta-ink">
                  {formatRM(result.monthlySavings)}
                </p>
                <p className="mt-1 text-xs font-medium text-base-slate">per month</p>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-wow-magenta/25 pt-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">
                      Over 10 Years
                    </p>
                    <p className="mt-1 text-xl font-bold text-base-ink">
                      {formatRM(result.savings10yr)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">
                      Over 30 Years
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
              Send me my report and give me my quotation
            </a>

            <p className="mt-4 text-xs leading-relaxed text-base-slate">
              This is an estimate based on your average monthly usage. Actual system size, savings
              and pricing may vary depending on real electricity consumption, roof space, shading,
              site conditions and final site assessment.
            </p>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-base-slate">
            Enter your average monthly TNB bill above to see your personalised solar estimate.
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
