import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { OLD_SITE_IMAGES } from "@/lib/content";

const BEFORE_AMOUNT = 796.35;
const AFTER_AMOUNT = 14.8;
const SAVED_AMOUNT = BEFORE_AMOUNT - AFTER_AMOUNT;
const SAVED_PERCENT = Math.round((SAVED_AMOUNT / BEFORE_AMOUNT) * 100);

function formatRM(value: number) {
  return `RM${value.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BillProof() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Real results"
        title="See our customers' electric bills"
        body="Helping homeowners lower their bills with the sun. A real TNB bill, before and after switching to MAQO Solar."
      />

      <div className="mt-10 grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
        <figure className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative aspect-square">
            <Image
              src={OLD_SITE_IMAGES.billBefore}
              alt="Customer TNB electric bill before MAQO Solar, totalling RM796.35"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
          </div>
          <figcaption className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-center text-xs font-medium text-slate-500">
            Before switching · bill due 19 Jul 2025
          </figcaption>
        </figure>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden
          className="mx-auto h-8 w-8 rotate-90 text-maqo-green-dark lg:rotate-0"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
        </svg>

        <figure className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative aspect-square">
            <Image
              src={OLD_SITE_IMAGES.billAfter}
              alt="Customer TNB electric bill after MAQO Solar, totalling RM14.80"
              fill
              className="object-contain"
              sizes="(min-width: 1024px) 38vw, 100vw"
            />
          </div>
          <figcaption className="border-t border-slate-100 bg-slate-50/60 px-4 py-2.5 text-center text-xs font-medium text-slate-500">
            After switching · bill due 1 Aug 2025
          </figcaption>
        </figure>
      </div>

      <div className="mx-auto mt-6 max-w-md rounded-2xl border border-maqo-green/20 bg-maqo-green/5 px-6 py-4 text-center">
        <p className="section-eyebrow text-xs font-semibold uppercase text-maqo-green-dark">
          Real customer result
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {formatRM(SAVED_AMOUNT)} saved that month
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {formatRM(BEFORE_AMOUNT)} → {formatRM(AFTER_AMOUNT)}, a {SAVED_PERCENT}% drop on this
          TNB bill after switching to MAQO Solar
        </p>
      </div>
    </section>
  );
}
