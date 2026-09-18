import type { Dictionary } from "@/lib/i18n";
import type { PublishedAchievement } from "@/lib/publishedContent";
import SectionTag from "./SectionTag";

function CheckBadge() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="var(--color-brand-green)" />
      <path d="M7.5 12.5l2.8 2.8 5.7-6.1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Achievements({ t, items }: { t: Dictionary["achievements"]; items: PublishedAchievement[] }) {
  return (
    <section className="relative overflow-hidden bg-base-bg py-16 sm:py-20">
      <div aria-hidden className="atap-hero-glow atap-hero-dots pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTag>{t.eyebrow}</SectionTag>
        <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">{t.title}</h2>

        <div className="mt-10 rounded-3xl border border-base-line bg-base-panel p-7 shadow-lg sm:p-10">
          <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {items.map((a) => (
              <div key={a.title} className="flex gap-3.5">
                <CheckBadge />
                <div>
                  <p className="font-bold text-brand-orange-ink">{a.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-base-ink">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
