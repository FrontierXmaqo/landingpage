import Image from "next/image";
import { BRAND_LOGOS } from "@/lib/content";

export default function BrandStrip() {
  const track = [...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <section className="border-y border-slate-100 bg-slate-50/60 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="section-eyebrow text-center text-xs font-semibold uppercase text-slate-500">
          Installed with brands homeowners trust
        </p>
      </div>
      <div className="relative mt-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-50 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-50 to-transparent sm:w-24" />
        <div className="flex w-max animate-marquee-ltr items-center">
          {track.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="mx-6 flex shrink-0 items-center justify-center gap-2.5 sm:mx-10"
            >
              <div className="relative h-8 w-8 shrink-0 sm:h-9 sm:w-9">
                <Image
                  src={brand.logo}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain"
                  unoptimized={brand.logo.endsWith(".svg")}
                />
              </div>
              <span className="whitespace-nowrap text-base font-semibold text-slate-500 sm:text-lg">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
