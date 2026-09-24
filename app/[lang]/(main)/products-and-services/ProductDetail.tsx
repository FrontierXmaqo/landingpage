"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "./products";
import { CATEGORIES } from "./products";
import s from "./products.module.css";

/** Native <dialog>: Escape, focus trapping and the backdrop come for free. */
export default function ProductDetail({
  product,
  open,
  ctaHref,
  onClose,
}: {
  /** Kept after closing so content stays put while the dialog fades out. */
  product: Product | null;
  open: boolean;
  ctaHref: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  const p = product;
  const cat = p ? CATEGORIES.find((c) => c.id === p.category)! : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-labelledby="product-detail-title"
      className={`${s.dialog} ${p ? s[`cat-${p.category}`] : ""} m-auto max-h-[92dvh] w-[min(100%-2rem,960px)] overflow-y-auto rounded-[22px] bg-base-bg p-0 text-base-ink`}
    >
      {p && cat && (
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-base-panel text-base-ink shadow-sm transition hover:bg-base-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-ink"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="grid gap-0 md:grid-cols-[5fr_6fr]">
            <Gallery key={p.id} product={p} />

            {/* Summary */}
            <div className="p-6 sm:p-8">
              <span className="inline-block rounded-md bg-[var(--cat)] px-2.5 py-1 text-xs font-semibold text-white">{cat.label}</span>
              <p className="mt-4 text-sm font-semibold text-base-slate">{p.brand}</p>
              <h2 id="product-detail-title" className="mt-1 pr-10 text-3xl font-extrabold leading-tight">
                {p.name}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-base-slate">{p.tagline}</p>
              <p className="mt-5 text-sm leading-relaxed">{p.overview}</p>
              <Link
                href={ctaHref}
                onClick={onClose}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--cat)] px-7 text-sm font-semibold text-white transition hover:brightness-110"
              >
                Get a quote with {p.brand}
              </Link>
            </div>
          </div>

          <div className="grid gap-8 border-t border-base-line p-6 sm:p-8 md:grid-cols-2">
            <DetailList title="Key features" items={p.features} />
            <DetailList title="What it means for you" items={p.benefits} />

            <section className="md:col-span-2">
              <h3 className="text-lg font-bold">Technical specifications</h3>
              <dl className="mt-3 divide-y divide-base-line overflow-hidden rounded-xl border border-base-line bg-base-panel text-sm">
                {p.specs.map((row) => (
                  <div key={row.label} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-4 py-2.5">
                    <dt className="text-base-slate">{row.label}</dt>
                    <dd className="font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <DetailList title="Where it fits" items={p.applications} />

            <section>
              <h3 className="text-lg font-bold">Common questions</h3>
              <div className="mt-3 space-y-2">
                {p.faq.map((f) => (
                  <details key={f.q} className="group rounded-xl border border-base-line bg-base-panel px-4 py-3">
                    <summary className="cursor-pointer list-none text-sm font-semibold marker:hidden">
                      <span className="flex items-start justify-between gap-3">
                        {f.q}
                        <span aria-hidden className="text-[var(--cat)] transition-transform group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-base-slate">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </dialog>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section>
      <h3 className="text-lg font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {items.map((it) => (
          <li key={it} className="flex gap-2.5">
            <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-[var(--cat)]" />
            {it}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Gallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  return (
    <div className="bg-[var(--cat-tint)]/50 p-6 sm:p-8">
      <div className="relative aspect-square">
        <Image
          key={product.images[active].src}
          src={product.images[active].src}
          alt={product.images[active].alt}
          fill
          sizes="(min-width: 768px) 420px, 90vw"
          className={`${s.enter} object-contain mix-blend-multiply`}
        />
      </div>
      {product.images.length > 1 && (
        <div className="mt-4 flex justify-center gap-3" role="group" aria-label="Product images">
          {product.images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={img.alt}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 bg-base-panel transition ${
                i === active ? "border-[var(--cat)]" : "border-base-line hover:border-base-field"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="64px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
