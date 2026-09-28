import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { PRODUCTS } from "@/app/[lang]/(main)/products-and-services/products";
import { PAGE_COPY } from "@/app/[lang]/(main)/products-and-services/copy";
import { loadSection } from "../site-content/actions";
import SectionHeader from "../site-content/SectionHeader";
import ProductsEditor from "./ProductsEditor";
import ServicesEditor from "./ServicesEditor";

export default async function ProductsServicesAdminPage() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "marketing"].includes(profile.role)) redirect("/admin");

  const [products, services] = await Promise.all([
    loadSection("products", PRODUCTS),
    loadSection("services", PAGE_COPY.en.services),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-base-ink">Products &amp; Services</h1>
      <p className="mt-1 text-sm text-base-slate">
        Everything on /products-and-services. Products and services save and publish separately. English only: the Chinese
        and Malay pages keep their built-in translations.
      </p>

      <nav
        aria-label="Jump to a section"
        className="sticky top-0 z-10 mt-6 flex w-fit gap-1 rounded-full border border-base-line bg-base-panel/95 p-1 shadow-sm backdrop-blur"
      >
        <a href="#products" className="rounded-full px-4 py-2 text-sm font-semibold text-base-slate transition hover:bg-base-bg hover:text-base-ink">
          Products <span className="text-xs font-medium">{products.data.length}</span>
        </a>
        <a href="#services" className="rounded-full px-4 py-2 text-sm font-semibold text-base-slate transition hover:bg-base-bg hover:text-base-ink">
          Services <span className="text-xs font-medium">{services.data.length}</span>
        </a>
      </nav>

      <div className="mt-8 space-y-12">
        <section id="products" className="scroll-mt-20">
          <SectionHeader
            section="products"
            title="Product catalogue"
            hint="The cards and the detail dialog both render from these fields. A product needs at least one image to appear on the site."
            lastPublished={products.lastPublished}
            status={products.status}
          />
          <div className="mt-4">
            <ProductsEditor initial={products.data} />
          </div>
        </section>

        <section id="services" className="scroll-mt-20">
          <SectionHeader
            section="services"
            title="Services"
            hint="The “Our Services” grid under the catalogue. Icons follow each card's position."
            lastPublished={services.lastPublished}
            status={services.status}
          />
          <div className="mt-4">
            <ServicesEditor initial={services.data} />
          </div>
        </section>
      </div>
    </div>
  );
}
