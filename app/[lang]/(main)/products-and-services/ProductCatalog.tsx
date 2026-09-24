"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { CATEGORIES, PRODUCTS, type Category, type Product } from "./products";
import s from "./products.module.css";

export default function ProductCatalog({ ctaHref }: { ctaHref: string }) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);
  const list = filter === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

  const tabs: { id: Category | "all"; label: string; count: number }[] = [
    { id: "all", label: "All products", count: PRODUCTS.length },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: PRODUCTS.filter((p) => p.category === c.id).length })),
  ];

  return (
    <>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = filter === t.id;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(t.id)}
              className={`${t.id !== "all" ? s[`cat-${t.id}`] : ""} inline-flex min-h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-base-ink ${
                on
                  ? "border-transparent bg-[var(--cat,var(--color-base-ink))] text-white"
                  : "border-base-line bg-base-panel text-base-ink hover:border-base-field"
              }`}
            >
              {t.id !== "all" && (
                <span aria-hidden className={`h-2 w-2 ${on ? "bg-white" : "bg-[var(--cat)]"}`} />
              )}
              {t.label}
              <span className={on ? "text-white/80" : "text-base-slate"}>{t.count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {list.length} products
      </p>

      <ul key={filter} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <li key={p.id} className={s.enter} style={{ animationDelay: `${i * 60}ms` }}>
            <ProductCard product={p} onOpen={(prod) => {
                setSelected(prod);
                setOpen(true);
              }} />
          </li>
        ))}
      </ul>

      <ProductDetail product={selected} open={open} ctaHref={ctaHref} onClose={() => setOpen(false)} />
    </>
  );
}
