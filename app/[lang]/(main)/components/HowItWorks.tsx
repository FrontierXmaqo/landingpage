import SectionHeading from "./SectionHeading";
import type { Dictionary } from "@/lib/i18n";

export default function HowItWorks({ t }: { t: Dictionary["howItWorks"] }) {
  return (
    <section className="bg-base-bg py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {t.steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl border border-base-line bg-base-panel p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="mt-4 text-sm font-semibold text-base-ink">{s.title}</h3>
              <p className="mt-2 text-sm text-base-slate">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
