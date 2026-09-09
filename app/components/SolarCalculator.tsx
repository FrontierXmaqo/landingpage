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
  { value: "neo", label: "With Battery Storage", hint: "Sigen Neo — solar + battery" },
  { value: "hybrid", label: "Without Battery Storage", hint: "Sigen Hybrid — solar only" },
];

export default function SolarCalculator() {
  const [billInput, setBillInput] = useState("650");
  const [storageOption, setStorageOption] = useState<StorageOption>("neo");

  const bill = parseFloat(billInput) || 0;

  const result = useMemo(() => {
    if (bill <= 0) return null;

    const {
      tariffTierThresholdKwh,
      tariffBelowThresholdPerKwh,
      tariffAboveThresholdPerKwh,
      suriaRebatePerKwac,
      suriaRebateCap,
      maqoAnniversaryRebateFlat,
    } = SOLAR_CALC_CONFIG;

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
    const paybackYears = isAboveThreshold
      ? selected.paybackYearsAboveThreshold
      : selected.paybackYearsBelowThreshold;

    const suriaRebate = Math.min(selected.kWac * suriaRebatePerKwac, suriaRebateCap);
    const maqoRebate = maqoAnniversaryRebateFlat;
    const finalPrice = Math.max(0, selected.standardSellingPrice - suriaRebate - maqoRebate);

    return {
      consumptionKwh,
      selected,
      monthlySavings,
      paybackYears,
      systemPrice: selected.standardSellingPrice,
      suriaRebate,
      maqoRebate,
      finalPrice,
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

      <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
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
                  <span className="mt-0.5 block font-normal text-slate-500">{opt.hint}</span>
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
              {Math.round(result.consumptionKwh).toLocaleString("en-US")} kWh, matched to our{" "}
              {result.selected.inverterModel} package.
            </p>

            {result.exceedsLargestPackage && (
              <p className="mt-3 rounded-lg bg-maqo-orange/10 px-3 py-2 text-xs text-maqo-orange-dark">
                Your usage is higher than our largest standard package can fully offset — the
                estimate below is based on that package. Our team can design a larger custom
                system for you.
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="mt-1 text-2xl font-bold text-slate-900">{result.selected.panels} panels</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-maqo-green/10 text-maqo-green-dark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10M11 20V4M18 20v-7" />
                  </svg>
                </span>
                <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
                  Estimated Monthly Savings
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatRM(result.monthlySavings)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-maqo-green/10 text-maqo-green-dark">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" d="M12 7v5l3 3" />
                  </svg>
                </span>
                <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
                  Estimated Payback Period
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {result.paybackYears.toFixed(1)} yrs
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Estimated Pricing (Cash Payment)
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600">Estimated Solar System Price</dt>
                  <dd className="shrink-0 font-semibold text-slate-900">
                    {formatRM(result.systemPrice)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600">
                    SuRIA Home Rebate
                    <span className="ml-1 text-xs text-slate-500">
                      (RM{SOLAR_CALC_CONFIG.suriaRebatePerKwac}/kWac, capped at{" "}
                      {formatRM(SOLAR_CALC_CONFIG.suriaRebateCap)})
                    </span>
                  </dt>
                  <dd className="shrink-0 font-semibold text-maqo-green-dark">
                    -{formatRM(result.suriaRebate)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-600">
                    MAQO Anniversary Rebate
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-maqo-orange/10 px-2 py-0.5 text-[11px] font-medium text-maqo-orange-dark">
                      Limited-time — until {SOLAR_CALC_CONFIG.maqoAnniversaryRebateValidUntil}
                    </span>
                  </dt>
                  <dd className="shrink-0 font-semibold text-maqo-green-dark">
                    -{formatRM(result.maqoRebate)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-maqo-green/5 px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Estimated Final Price</p>
                  <p className="text-xs text-slate-500">After SuRIA Home + MAQO Anniversary Rebate</p>
                </div>
                <p className="text-2xl font-bold text-maqo-green-dark">
                  {formatRM(result.finalPrice)}
                </p>
              </div>
            </div>

            <a
              href="#assessment"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-maqo-orange px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-95"
            >
              Get My Personalised Quote
            </a>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              This is an estimated price based on cash payment. Final system size, savings and
              pricing may vary depending on actual electricity consumption, roof space, shading,
              site conditions and final site assessment.
            </p>
          </div>
        ) : (
          <div className="p-10 text-center text-sm text-slate-500">
            Enter your average monthly TNB bill above to see your personalised solar estimate.
          </div>
        )}
      </div>
    </section>
  );
}
