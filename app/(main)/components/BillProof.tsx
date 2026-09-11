"use client";

import { useState } from "react";
import Image from "next/image";
import SectionTag from "./SectionTag";

type Month = { m: string; v: number; approx?: boolean };

type Case = {
  id: string;
  tab: string;
  title: string;
  size: string;
  months: Month[];
  proof: string;
  proofAlt: string;
  note?: string;
};

const CASES: Case[] = [
  {
    id: "battery",
    tab: "Solar + battery",
    title: "Single-phase home, solar with battery storage",
    size: "7.44 kWp",
    months: [
      { m: "Feb", v: 522.2 },
      { m: "Mar", v: 466.5 },
      { m: "Apr", v: 624.95 },
      { m: "May", v: 384.75 },
      { m: "Jun", v: 203.15 },
      { m: "Jul", v: 92.75 },
    ],
    proof: "/bill-proof-battery.jpg",
    proofAlt:
      "TNB account usage history screenshot, February to July 2026, showing monthly bills falling from RM624.95 to RM92.75",
    note: "This account moved onto a Time of Use tariff from the June bill.",
  },
  {
    id: "solar",
    tab: "Solar only",
    title: "Single-phase home, solar without storage",
    size: "7.44 kWp",
    months: [
      { m: "Feb", v: 334.35 },
      { m: "Mar", v: 238.75 },
      { m: "Apr", v: 85.55 },
      { m: "May", v: 88.9 },
      { m: "Jun", v: 91.2 },
      { m: "Jul", v: 81.9 },
    ],
    proof: "/bill-proof-solar.jpg",
    proofAlt:
      "TNB account usage history screenshot, February to July 2026, showing monthly bills falling from RM334.35 to RM81.90",
  },
  {
    id: "atap",
    tab: "ATAP programme",
    title: "Larger home on the ATAP programme",
    size: "13.02 kWp",
    months: [
      { m: "Feb", v: 953.4 },
      { m: "Mar", v: 1070, approx: true },
      { m: "Apr", v: 1090, approx: true },
      { m: "May", v: 1260, approx: true },
      { m: "Jun", v: 428.85 },
      { m: "Jul", v: 457.2 },
    ],
    proof: "/bill-proof-atap.jpg",
    proofAlt:
      "TNB account usage history screenshot, February to July 2026, showing monthly bills falling from RM1.26k to RM428.85",
  },
];

function money(m: Month) {
  if (m.approx) return `RM${(m.v / 1000).toFixed(2)}k`;
  return `RM${m.v.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Narrow screens cannot fit six "RM522.20" labels across, so they get the rounded ringgit.
function moneyShort(m: Month) {
  if (m.approx) return `${(m.v / 1000).toFixed(2)}k`;
  return Math.round(m.v).toLocaleString("en-MY");
}

export default function BillProof() {
  const [active, setActive] = useState(0);
  const [showProof, setShowProof] = useState(false);
  // Once the reader has opened the proof, the button stops asking for attention.
  const [nudged, setNudged] = useState(false);
  const c = CASES[active];

  const peak = c.months.reduce((a, b) => (b.v > a.v ? b : a));
  const low = c.months.reduce((a, b) => (b.v < a.v ? b : a));
  const drop = Math.round(((peak.v - low.v) / peak.v) * 100);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="max-w-xl">
        <SectionTag>Real results</SectionTag>
        <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
          Watch the bill{" "}
          <span className="text-brand-orange-ink">fall off a cliff.</span>
        </h2>
        <p className="mt-4 text-base leading-relaxed text-base-slate">
          Six months of real TNB bills from MAQO customers, February to July 2026. Flip to the
          original account screenshots any time. These are not our numbers, they are TNB&apos;s.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Customer bill histories"
        className="mt-8 inline-flex flex-wrap gap-1.5 rounded-full border border-base-line bg-base-bg p-1.5"
      >
        {CASES.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
              i === active
                ? "bg-brand-green text-base-ink shadow-sm"
                : "text-base-slate hover:text-base-ink"
            }`}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0 rounded-3xl border border-base-line bg-base-panel p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-base-ink">{c.title}</p>
              <p className="mt-1 text-xs text-base-slate">
                Monthly TNB bill, Feb to Jul 2026 &middot; {c.size} system
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 sm:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-pressed={!showProof}
                  onClick={() => setShowProof(false)}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    !showProof
                      ? "border-base-line bg-base-panel text-base-ink"
                      : "border-transparent text-base-slate hover:text-base-ink"
                  }`}
                >
                  Chart
                </button>

                <button
                  type="button"
                  aria-pressed={showProof}
                  onClick={() => {
                    setShowProof(true);
                    setNudged(true);
                  }}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-green-deep px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-110 ${
                    showProof ? "ring-2 ring-brand-green ring-offset-2" : ""
                  } ${!showProof && !nudged ? "animate-attention-ring" : ""}`}
                >
                  {/* Eye: the action is literally "look at the customer's bill" */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
                    />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  See the real TNB bill
                </button>
              </div>

              {!showProof && (
                <p className="text-[11px] font-medium text-base-slate">
                  Don&apos;t take our word for it
                </p>
              )}
            </div>
          </div>

          {showProof ? (
            <figure className="mt-6">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-base-line bg-base-bg">
                <Image
                  key={c.id}
                  src={c.proof}
                  alt={c.proofAlt}
                  fill
                  className="object-contain"
                  sizes="(min-width: 1024px) 680px, 100vw"
                />
              </div>
              <figcaption className="mt-3 text-xs text-base-slate">
                Straight from the customer&apos;s own TNB account, shared with their permission.
              </figcaption>
            </figure>
          ) : (
            <div key={c.id} className="mt-8">
              <div className="flex h-56 items-end gap-2 sm:gap-4">
                {c.months.map((m, i) => {
                  const isLow = m.v <= peak.v * 0.5;
                  return (
                    <div
                      key={m.m}
                      className="flex h-full flex-1 flex-col items-center justify-end"
                    >
                      <span
                        className={`mb-2 whitespace-nowrap text-[10px] font-bold sm:text-xs ${
                          isLow ? "text-brand-green-ink" : "text-base-slate"
                        }`}
                      >
                        <span className="sm:hidden">{moneyShort(m)}</span>
                        <span className="hidden sm:inline">{money(m)}</span>
                      </span>
                      {/* One data series, so one chart token. The low months are the same
                          colour at full strength rather than a second hue, and every bar
                          already carries its ringgit value and month as a label. */}
                      <div
                        className={`animate-bar-rise w-full max-w-[44px] rounded-full bg-chart-1 ${
                          isLow ? "" : "opacity-30"
                        }`}
                        style={{
                          height: `${(m.v / peak.v) * 80}%`,
                          animationDelay: `${i * 90}ms`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2 border-t border-base-line pt-3 sm:gap-4">
                {c.months.map((m) => (
                  <span
                    key={m.m}
                    className="flex-1 text-center text-xs font-medium text-base-slate"
                  >
                    {m.m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-brand-green bg-brand-green-tint p-6 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green-ink">
            Lowest month
          </p>
          <p className="mt-2 text-4xl font-bold leading-none text-base-ink">{money(low)}</p>
          <p className="mt-3 text-sm leading-relaxed text-base-slate">
            Down from {money(peak)} at its peak in {peak.m}, a drop of{" "}
            <span className="font-bold text-brand-green-ink">
              {peak.approx ? "about " : ""}
              {drop}%
            </span>
            .
          </p>
          <dl className="mt-5 flex items-baseline justify-between gap-4 border-t border-brand-green pt-4">
            <dt className="text-xs text-base-slate">System size</dt>
            <dd className="text-sm font-bold text-base-ink">{c.size}</dd>
          </dl>
          {c.note && (
            <p className="mt-3 text-xs leading-relaxed text-base-slate">{c.note}</p>
          )}
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-base-slate">
        Bills vary with household usage, roof conditions and tariff, so your own result will
        differ.
      </p>
    </section>
  );
}
