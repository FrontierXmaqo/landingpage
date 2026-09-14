import Image from "next/image";
import SectionTag from "./SectionTag";
import ScrollReveal from "./ScrollReveal";
import { OLD_SITE_IMAGES } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";

export default function WhatsIncluded({
  t,
  space,
}: {
  t: Dictionary["whatsIncluded"];
  space: string;
}) {
  return (
    <section className="border-y border-base-line bg-base-panel py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <ScrollReveal>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl sm:aspect-[16/10]">
              <Image
                src={OLD_SITE_IMAGES.gallery[5]}
                alt={t.imageAlt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 640px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-ink/90 via-base-ink/35 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                <p className="text-lg font-bold leading-snug text-white sm:text-xl">
                  {t.overlayTitle}
                </p>
                <p className="mt-1.5 text-sm text-white/85">
                  {t.overlayBody}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={120}>
            <SectionTag>{t.tag}</SectionTag>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-base-ink sm:text-4xl">
              {t.titleLead}
              {space}
              <span className="text-brand-orange-ink">{t.titleAccent}</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-base-slate">
              {t.body}
            </p>
            <ul className="mt-8 border-t border-base-line">
              {t.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3.5 border-b border-base-line py-3.5"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-green-tint text-xs font-bold text-brand-green-ink">
                    ✓
                  </span>
                  <span className="text-base font-medium text-base-ink">{item}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
