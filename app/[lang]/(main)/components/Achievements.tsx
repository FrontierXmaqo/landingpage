import CountUpStat from "./CountUpStat";
import type { Dictionary } from "@/lib/i18n";
import type { PublishedAchievement } from "@/lib/publishedContent";

export default function Achievements({ t, items }: { t: Dictionary["achievements"]; items: PublishedAchievement[] }) {
  return (
    <section className="bg-brand-green-deep py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="section-eyebrow text-center text-xs font-semibold uppercase text-white">
          {t.eyebrow}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {items.map((a) => (
            <div key={a.label}>
              <div className="text-4xl font-bold text-white">
                <CountUpStat value={a.value} />
              </div>
              <div className="mt-2 text-sm text-white">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
