import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import type { PublishedBrandLogo } from "@/lib/publishedContent";

/**
 * Scrolling roster of the brands we install. The track holds two copies of the
 * list and slides left by exactly half its width, so the second copy lands
 * where the first began and the loop is seamless — and because it starts at 0
 * rather than mid-track, the first thing a visitor sees is the first logo.
 *
 * Under reduced motion the CSS collapses this into a static centred grid rather
 * than parking the track: a frozen 1400px strip in a 390px viewport would clip
 * most of the roster off-screen with no way to reach it.
 */
export default function BrandStrip({ t, brands }: { t: Dictionary["brandStrip"]; brands: PublishedBrandLogo[] }) {
  return (
    <section className="border-y border-base-line bg-base-bg py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="section-eyebrow text-center text-xs font-semibold uppercase text-base-slate">
          {t.title}
        </p>
      </div>
      <div className="relative mt-5 overflow-hidden">
        <div className="brand-marquee-fade pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base-bg to-transparent sm:w-24" />
        <div className="brand-marquee-fade pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base-bg to-transparent sm:w-24" />
        <div className="brand-marquee flex w-max items-center">
          {[0, 1].map((copy) => (
            // The second copy is what makes the loop seamless; it is decorative
            // repetition, so it is hidden from assistive tech and dropped
            // entirely once the track stops moving.
            <div
              key={copy}
              className={copy === 1 ? "brand-marquee-dupe contents" : "contents"}
              aria-hidden={copy === 1 || undefined}
            >
              {brands.map((brand) => (
                <div
                  key={`${copy}-${brand.name}`}
                  className="mx-6 flex shrink-0 items-center justify-center gap-2.5 sm:mx-10"
                >
                  {brand.logo && (
                    <div className="relative h-8 w-8 shrink-0 sm:h-9 sm:w-9">
                      <Image
                        src={brand.logo}
                        alt=""
                        fill
                        sizes="36px"
                        className="object-contain opacity-70 grayscale"
                      />
                    </div>
                  )}
                  <span className="whitespace-nowrap text-base font-semibold text-base-slate sm:text-lg">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
