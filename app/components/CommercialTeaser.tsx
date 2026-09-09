import Image from "next/image";
import { OLD_SITE_IMAGES } from "@/lib/content";

export default function CommercialTeaser() {
  const track = [...OLD_SITE_IMAGES.clientLogos, ...OLD_SITE_IMAGES.clientLogos];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          We also provide solar energy solutions for Commercial &amp; Industrial
        </h2>
        <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Other big clients who are committed to a sustainable future
        </p>
        <div className="relative mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
          <div className="flex w-max animate-marquee-ltr items-center">
            {track.map((src, i) => (
              <div key={`${src}-${i}`} className="relative mx-6 h-10 w-28 shrink-0 sm:mx-10 sm:h-12 sm:w-32">
                <Image
                  src={src}
                  alt={`MAQO commercial & industrial client logo ${(i % OLD_SITE_IMAGES.clientLogos.length) + 1}`}
                  fill
                  className="object-contain"
                  sizes="140px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
