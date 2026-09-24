import Image from "next/image";
import type { Product } from "./products";
import type { CatalogUi } from "./copy";
import s from "./products.module.css";

export default function ProductCard({
  product,
  ui,
  onOpen,
}: {
  product: Product;
  ui: CatalogUi;
  onOpen: (p: Product) => void;
}) {
  const cover = product.images[0];

  return (
    <article
      className={`${s.card} ${s[`cat-${product.category}`]} flex h-full flex-col overflow-hidden rounded-[22px] border border-base-line bg-base-panel`}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-base-line bg-white">
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`${s.shot} object-contain p-6`}
        />
        <span className="absolute left-4 top-4 rounded-md bg-[var(--cat)] px-2.5 py-1 text-xs font-semibold text-white">
          {ui.categories[product.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold text-base-slate">{product.brand}</p>
        <h3 className="mt-1 text-xl font-bold leading-snug text-base-ink">{product.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-base-slate">{product.tagline}</p>

        <ul className="mt-4 space-y-1.5 text-sm text-base-ink">
          {product.highlights.map((h) => (
            <li key={h} className="flex gap-2">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-[var(--cat)]" />
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={() => onOpen(product)}
            aria-label={ui.viewProductLabel(product.name)}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[var(--cat)] px-6 text-sm font-semibold text-[var(--cat)] transition-colors hover:bg-[var(--cat)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cat)]"
          >
            {ui.viewProduct}
          </button>
        </div>
      </div>
    </article>
  );
}
