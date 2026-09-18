import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";
import type { PublishedBrandLogo } from "@/lib/publishedContent";

/**
 * Scrolling roster of the brands we install.
 *
 * Laid out as uniform fixed-width tiles, the same shape as the C&I client
 * marquee but without its border, so the brands stay on an even rhythm as they
 * pass. Variable-width items packed by their own text length made the strip
 * look like it was chopping logos in half at the edges.
 *
 * The track is the roster twice over and slides exactly half its width, so the
 * second copy lands where the first began and the loop is seamless — and
 * because it starts at 0 rather than mid-track, the first thing a visitor sees
 * is the first brand.
 *
 * Under reduced motion the CSS collapses this into a static centred grid rather
 * than parking the track: a frozen strip several times wider than a phone
 * viewport would clip most of the roster off-screen with no way to reach it.
 */
export default function BrandStrip({ t, brands }: { t: Dictionary["brandStrip"]; brands: PublishedBrandLogo[] }) {
  const track = [...brands, ...brands];

  return (
    <section className="border-y border-base-line bg-base-bg py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="section-eyebrow text-center text-xs font-semibold uppercase text-base-slate">
          {t.title}
        </p>
      </div>
      <div className="relative mt-5 overflow-hidden">
        <div className="brand-marquee-fade pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-base-bg to-transparent sm:w-24 lg:w-40" />
        <div className="brand-marquee-fade pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-base-bg to-transparent sm:w-24 lg:w-40" />
        <ul className="brand-marquee flex w-max items-stretch">
          {track.map((brand, i) => {
            // The second copy exists only to make the loop seamless: hidden from
            // assistive tech, and dropped once the track stops moving.
            const isDuplicate = i >= brands.length;
            return (
              <li
                key={`${brand.name}-${i}`}
                aria-hidden={isDuplicate || undefined}
                className={`flex h-16 w-40 shrink-0 items-center justify-center gap-2.5 px-3 sm:w-48 ${
                  isDuplicate ? "brand-marquee-dupe" : ""
                }`}
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
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
