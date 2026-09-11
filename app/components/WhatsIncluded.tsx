import SectionTag from "./SectionTag";
import { WHATS_INCLUDED } from "@/lib/content";

export default function WhatsIncluded() {
  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTag>What&apos;s covered</SectionTag>
        <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
          Everything you need for peace of mind
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {WHATS_INCLUDED.map((item) => (
            <div
              key={item}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 px-3 py-5 text-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-maqo-green/10 text-maqo-green-dark">
                ✓
              </span>
              <span className="text-xs font-medium text-slate-700 sm:text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
