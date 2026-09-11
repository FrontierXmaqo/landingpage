import Image from "next/image";
import LeadForm from "./LeadForm";
import { OLD_SITE_IMAGES, STATS } from "@/lib/content";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-maqo-green/5 to-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <span className="section-eyebrow inline-flex items-center rounded-full bg-maqo-green/10 px-3 py-1 text-xs font-semibold uppercase text-maqo-green-dark">
            MAQO ATAP · Residential Solar Programme
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Cut your TNB bill by up to 90%.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
            Empowering a cleaner future for your home since 2013. Free home assessment,
            transparent packages, and{" "}
            <span className="animate-credential-highlight font-bold text-maqo-green-dark">
              ST Class A &amp; CIDB G7-certified
            </span>{" "}
            installation across Peninsular Malaysia, trusted by 1,000+ Malaysian homeowners.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#assessment"
              className="inline-flex items-center justify-center rounded-full bg-maqo-orange px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-95"
            >
              Get My Free Assessment
            </a>
            <a
              href="#packages"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Calculate My Savings
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-lg font-bold text-slate-900 sm:text-xl">{s.value}</div>
                <div className="mt-0.5 text-xs text-slate-500 sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="relative mt-8 hidden aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-xl sm:block">
            <Image
              src={OLD_SITE_IMAGES.heroHouse}
              alt="MAQO Solar rooftop installation on a Malaysian home at sunset"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 560px, 100vw"
              priority
            />
          </div>
        </div>

        <div className="lg:pl-4">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
