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
        body="Enter your average monthly TNB bill and choose whether you want battery storage — we'll match you to a package and estimate the system size, savings, and final price after rebates."
      />

      <div className="mt-10 rounded-3xl bg-gradient-to-br from-maqo-orange/60 via-maqo-orange/15 to-maqo-orange/60 p-[1.5px] shadow-[0_0_45px_-12px_rgba(244,154,34,0.55)]">
        <div className="overflow-hidden rounded-[calc(1.5rem-1.5px)] border border-slate-100 bg-white">
        <div className="grid grid-cols-1 gap-6 border-b border-slate-100 bg-slate-50/60 p-6 sm:grid-cols-2 sm:p-8">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            Average Monthly TNB Bill
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 focus-within:border-maqo-green focus-within:ring-2 focus-within:ring-maqo-green/30">
              <span className="text-sm font-semibold text-slate-500">RM</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={billInput}
                onChange={(e) => setBillInput(e.target.value)}
                placeholder="650"
                className="w-full text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <span className="whitespace-nowrap text-xs text-slate-500">/ month</span>
            </div>
            <span className="text-xs font-normal text-slate-500">
              You can find this amount on your latest TNB bill.
            </span>
          </label>

          <div className="flex flex-col gap-1.5 text-sm font-medium text-slate-700">
            System Type
            <div className="grid grid-cols-2 gap-2">
              {STORAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStorageOption(opt.value)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition ${
                    storageOption === opt.value
                      ? "border-maqo-green bg-maqo-green/10 text-maqo-green-dark"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  <span className="block text-sm">{opt.label}</span>
                  <span className="mt-0.5 block font-normal text-slate-600">{opt.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {result ? (
          <div className="p-6 sm:p-8">
            <p className="section-eyebrow text-xs font-semibold uppercase text-maqo-green-dark">
              Your solar estimate
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">
              Based on your TNB bill of {formatRM(bill)}/month
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Estimated for an average monthly usage of about{" "}
              {Math.round(result.consumptionKwh).toLocaleString("en-US")} kWh, sized to a{" "}
              {result.selected.kwp.toFixed(1)} kWp system.
            </p>

            {result.exceedsLargestPackage && (
              <p className="mt-3 rounded-lg bg-maqo-orange/10 px-3 py-2 text-xs text-maqo-orange-dark">
                Your usage is higher than our largest standard package can fully offset — the
                estimate below is based on that package. Our team can design a larger custom
                system for you.
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-maqo-green/10 text-maqo-green-dark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
                      <circle cx="12" cy="12" r="4" />
                      <path
                        strokeLinecap="round"
                        d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                      />
                    </svg>
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
                    Recommended System Size
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {result.selected.kwp.toFixed(1)} kWp
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-center">
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-maqo-green/10 text-maqo-green-dark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
                      <rect x="3" y="4" width="18" height="12" rx="1.5" />
                      <path strokeLinecap="round" d="M3 10h18M9 4v12M15 4v12M8 20h8" />
                    </svg>
                  </span>
                  <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
                    Estimated Number of Panels
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {result.selected.panels} panels
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-maqo-green/80 via-maqo-green-dark/50 to-maqo-green/80 p-[1.5px] shadow-[0_0_35px_-10px_rgba(64,179,68,0.5)]">
                <div className="relative overflow-hidden rounded-[calc(1rem-1.5px)] bg-maqo-green p-6 text-center text-slate-900 sm:p-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-3xl"
                  />
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-900">
                      Estimated Monthly Savings
                    </p>
                    <p className="mt-2 text-5xl font-extrabold leading-none">
                      {formatRM(result.monthlySavings)}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-900">per month</p>

                    <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-900/15 pt-5">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-900">
                          Over 10 Years
                        </p>
                        <p className="mt-1 text-xl font-bold">{formatRM(result.savings10yr)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-900">
                          Over 30 Years
                        </p>
                        <p className="mt-1 text-xl font-bold">{formatRM(result.savings30yr)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="#assessment"
              className="mt-8 flex items-center justify-center gap-2 rounded-full border-2 border-white/60 bg-gradient-to-b from-[#FFD54A] to-[#F5A623] px-8 py-5 text-base font-bold text-[#3a2a06] transition-all duration-150 ease-out shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_0_0_#a8690a,0_16px_28px_-10px_rgba(60,40,10,0.45),0_0_45px_-6px_rgba(247,181,60,0.9)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_8px_0_0_#a8690a,0_20px_32px_-10px_rgba(60,40,10,0.5),0_0_60px_-4px_rgba(247,181,60,1)] active:translate-y-1 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_0_0_#a8690a,0_6px_14px_-8px_rgba(60,40,10,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
            >
              Get My ROI Now
            </a>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              This is an estimate based on your average monthly usage. Actual system size, savings
              and pricing may vary depending on real electricity consumption, roof space, shading,
              site conditions and final site assessment.
            </p>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            Enter your average monthly TNB bill above to see your personalised solar estimate.
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
