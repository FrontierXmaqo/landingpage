"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Product } from "@/lib/content";

const CATEGORY_TINT: Record<Product["category"], string> = {
  "Solar Panels": "from-maqo-green/15 to-maqo-green/5",
  Inverters: "from-slate-200/70 to-slate-100/40",
  Batteries: "from-maqo-orange/20 to-maqo-orange/5",
};

export default function ProductDetail({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-heading"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 px-4 py-8 sm:py-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-modal-in w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className={`relative flex aspect-[16/9] items-center justify-center gap-4 bg-gradient-to-br p-8 ${CATEGORY_TINT[product.category]}`}>
          {product.images.map((src) => (
            <div key={src} className="relative h-full min-w-0 flex-1">
              <Image
                src={src}
                alt={`${product.name} product photo`}
                fill
                className="object-contain"
                sizes="640px"
              />
            </div>
          ))}
          <span className="absolute bottom-3 left-4 rounded-md bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 backdrop-blur-sm">
            {product.brand} · {product.model}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maqo-green"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
          <p className="section-eyebrow text-xs font-semibold uppercase text-maqo-green-dark">
            {product.category}
          </p>
          <h2 id="product-detail-heading" className="mt-1 text-2xl font-bold text-slate-900">
            {product.name}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{product.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.overview}</p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Key Features
            </h3>
            <ul className="mt-3 space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                    className="mt-0.5 h-4 w-4 shrink-0 text-maqo-green-dark"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Benefits</h3>
            <ul className="mt-3 space-y-2">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-maqo-orange" />
                  <span className="leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Technical Specifications
            </h3>
            <dl className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {product.specs.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="shrink-0 text-right font-semibold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

        </div>
      </div>
    </div>
  );
}
