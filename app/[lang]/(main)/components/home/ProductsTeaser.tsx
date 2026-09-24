import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import SectionTag from "../SectionTag";
import { localePath, type Locale } from "@/lib/i18n";

const COPY: Record<Locale, { eyebrow: string; title: string; body: string; cta: string; items: [string, string, string] }> = {
  en: {
    eyebrow: "Our products",
    title: "The hardware on your roof, named up front",
    body: "AIKO panels, Sigenergy and FoxESS inverters and batteries. See the specs before you sign.",
    cta: "See our products",
    items: ["Solar Panels", "Inverters", "Batteries"],
  },
  cn: {
    eyebrow: "我们的产品",
    title: "装在您屋顶上的设备，事先说清楚",
    body: "AIKO 太阳能板，Sigenergy 与 FoxESS 逆变器及电池。签约前先看清规格。",
    cta: "查看产品",
    items: ["太阳能板", "逆变器", "电池"],
  },
  ms: {
    eyebrow: "Produk kami",
    title: "Peralatan di bumbung anda, dinyatakan dari awal",
    body: "Panel AIKO, inverter dan bateri Sigenergy serta FoxESS. Lihat spesifikasi sebelum anda menandatangani.",
    cta: "Lihat produk kami",
    items: ["Panel Solar", "Inverter", "Bateri"],
  },
};

const SHOTS = [
  { src: "/products/aiko-comet-2u.jpg", tint: "bg-brand-green-tint" },
  { src: "/products/sigen-hybrid-inverter.webp", tint: "bg-brand-orange-tint" },
  { src: "/products/sigenstor-neo.png", tint: "bg-status-info-tint" },
];

/** Short pointer from the homepage to /products-and-services. */
export default function ProductsTeaser({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const href = localePath(locale, "/products-and-services");

  return (
    <section id="products" className="scroll-mt-20 bg-base-panel py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[5fr_7fr]">
        <ScrollReveal>
          <SectionTag>{t.eyebrow}</SectionTag>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-base-ink sm:text-3xl">{t.title}</h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-base-slate">{t.body}</p>
          <Link
            href={href}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-brand-orange-deep px-7 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
          >
            {t.cta}
          </Link>
        </ScrollReveal>

        <ScrollReveal delayMs={80}>
          <ul className="grid max-w-xl grid-cols-3 gap-3 sm:gap-5 lg:max-w-none">
            {SHOTS.map((shot, i) => (
              <li key={shot.src}>
                <Link href={href} className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green-ink">
                  <div className={`relative aspect-[3/4] overflow-hidden rounded-2xl ${shot.tint}`}>
                    <Image
                      src={shot.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 220px, 30vw"
                      className="object-contain p-3 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 sm:p-5"
                    />
                  </div>
                  <p className="mt-2 text-center text-xs font-semibold text-base-ink sm:text-sm">{t.items[i]}</p>
                </Link>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}
