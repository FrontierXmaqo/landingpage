import SectionHeading from "./SectionHeading";
import { PACKAGES } from "@/lib/content";

export default function Packages() {
  return (
    <section id="packages" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="ATAP Packages"
        title="Transparent packages, matched to your roof and your bill"
        body="Every ATAP package includes system design, ST Class A & CIDB G7-certified installation, TNB NEM/ATAP application, and after-sales monitoring. Exact pricing is confirmed after your free home assessment."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.name}
            className={`relative flex flex-col rounded-2xl border p-6 shadow-sm sm:p-8 ${
              pkg.popular
                ? "border-maqo-green bg-white shadow-lg shadow-maqo-green/10 lg:-translate-y-3"
                : "border-slate-200 bg-white"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-maqo-green px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-slate-900">{pkg.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{pkg.tagline}</p>
            <p className="mt-4 text-2xl font-bold text-slate-900">
              {pkg.price}
              <span className="text-sm font-medium text-slate-500"> /month equivalent*</span>
            </p>

            <dl className="mt-5 grid grid-cols-3 gap-2 border-y border-slate-100 py-4 text-center">
              <div>
                <dt className="text-[11px] font-semibold uppercase text-slate-400">
                  System size
                </dt>
                <dd className="mt-1 text-xs font-medium text-slate-700">{pkg.systemSize}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase text-slate-400">Panels</dt>
                <dd className="mt-1 text-xs font-medium text-slate-700">{pkg.panels}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase text-slate-400">
                  Best for TNB bill
                </dt>
                <dd className="mt-1 text-xs font-medium text-slate-700">{pkg.bestForBill}</dd>
              </div>
            </dl>

            <ul className="mt-5 flex-1 space-y-2.5">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="mt-0.5 text-maqo-green">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="#assessment"
              className={`mt-6 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold shadow-sm transition ${
                pkg.popular
                  ? "bg-maqo-green text-white hover:bg-maqo-green-dark"
                  : "border border-slate-300 text-slate-700 hover:border-slate-400"
              }`}
            >
              Get a quote for {pkg.name}
            </a>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">
        *Indicative pricing shown for illustration. Final quote depends on roof condition,
        shading, and financing option selected during your free home assessment.
      </p>
    </section>
  );
}
