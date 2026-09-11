import SectionHeading from "./SectionHeading";
import { HOW_IT_WORKS } from "@/lib/content";

export default function HowItWorks() {
  return (
    <section className="bg-slate-50/60 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From TNB bill to solar savings in 5 steps"
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-maqo-green text-sm font-bold text-white">
                {s.step}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
