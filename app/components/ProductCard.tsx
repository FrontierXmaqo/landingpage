import Image from "next/image";
import type { Product } from "@/lib/content";

const CATEGORY_STYLES: Record<Product["category"], { tint: string; pill: string }> = {
  "Solar Panels": {
    tint: "from-maqo-green/10 to-maqo-green/5",
    pill: "bg-maqo-green/10 text-maqo-green-dark",
  },
  Inverters: {
    tint: "from-slate-200/60 to-slate-100/30",
    pill: "bg-slate-200/70 text-slate-700",
  },
  Batteries: {
    tint: "from-maqo-orange/15 to-maqo-orange/5",
    pill: "bg-maqo-orange/10 text-maqo-orange-dark",
  },
};

export default function ProductCard({
  product,
  onViewDetails,
}: {
  product: Product;
  onViewDetails: (id: string) => void;
}) {
  const style = CATEGORY_STYLES[product.category];

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br ${style.tint}`}
      >
        <Image
          src={product.images[0]}
          alt={`${product.name} product photo`}
          fill
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <span className="absolute bottom-3 right-3 rounded-md bg-white/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 backdrop-blur-sm">
          {product.brand}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span
          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${style.pill}`}
        >
          {product.category}
        </span>
        <h3 className="mt-3 text-base font-bold text-slate-900">{product.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{product.shortDescription}</p>

        <button
          type="button"
          onClick={() => onViewDetails(product.id)}
          className="mt-auto flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:border-maqo-green hover:bg-maqo-green/5 hover:text-maqo-green-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maqo-green"
        >
          View Product
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </article>
  );
}
