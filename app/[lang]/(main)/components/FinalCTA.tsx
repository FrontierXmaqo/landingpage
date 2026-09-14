import type { Dictionary } from "@/lib/i18n";

export default function FinalCTA({ t, space }: { t: Dictionary["finalCta"]; space: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl bg-brand-orange-tint px-6 py-14 text-center sm:px-12">
        <h2 className="text-2xl font-bold text-base-ink sm:text-3xl">
          {t.titleLead}
          {space}
          <span className="text-brand-orange-ink">{t.titleAccent}</span>
          {t.titleTail}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-base-slate sm:text-base">
          {t.body}
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#assessment"
            className="inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-7 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
