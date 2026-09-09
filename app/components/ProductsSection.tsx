"use client";

import { useMemo, useState } from "react";
import SectionHeading from "./SectionHeading";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import { PRODUCT_CATEGORIES, PRODUCTS, type Product } from "@/lib/content";

const FILTERS: ("All" | Product["category"])[] = ["All", ...PRODUCT_CATEGORIES];

export default function ProductsSection() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [openProductId, setOpenProductId] = useState<string | null>(null);

  const filteredProducts = useMemo(
    () => (filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)),
    [filter],
  );

  const openProduct = PRODUCTS.find((p) => p.id === openProductId) ?? null;

  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Our Products"
        title="Our Solar Products"
        body="MAQO installs Tier 1, ST Class A-certified equipment — from record-efficiency panels to smart battery storage — matched to your home and budget."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((category) => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={isActive}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maqo-green ${
                isActive
                  ? "bg-maqo-green-dark text-white shadow-sm"
                  : "border border-slate-300 text-slate-600 hover:border-maqo-green hover:text-maqo-green-dark"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div
        key={filter}
        className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredProducts.map((product, i) => (
          <div
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <ProductCard product={product} onViewDetails={setOpenProductId} />
          </div>
        ))}
      </div>

      {openProduct && (
        <ProductDetail product={openProduct} onClose={() => setOpenProductId(null)} />
      )}
    </section>
  );
}
