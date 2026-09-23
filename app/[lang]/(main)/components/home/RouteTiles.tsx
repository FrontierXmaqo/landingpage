import Link from "next/link";
import ScrollReveal from "../ScrollReveal";
import SectionTag from "../SectionTag";
import { localePath, type Locale } from "@/lib/i18n";
import type { HomeCopy } from "./copy";

/** One glyph per destination, drawn rather than imported so the tiles cost
 *  no extra request and inherit their accent from the tile. */
const ICONS = [
  // a house
  <path key="home" d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9.5 21v-6h5v6" />,
  // a factory
  <path key="factory" d="M3 21h18M4 21V8l6-3v16M10 21V11l10-3v13M14 13h2M14 17h2" />,
  // a sun over a roof
  <path key="atap" d="M12 5.4a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6M12 2v1.2M17.6 8.2h1.4M5 8.2h1.4M16 4.2l.9-.9M8 4.2l-.9-.9M2.8 20.6 12 14.6l9.2 6" />,
  // a battery
  <path key="bess" d="M3 8.5h13a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5v-4A1.5 1.5 0 0 1 3 8.5ZM20 11v2M6 10v4M9.5 10v4M13 10v4" />,
];

/**
 * The secondary pathways, for a visitor who is not ready to fill in a form.
 * Every tile is a real route on this site; nothing here is a placeholder.
 */
export default function RouteTiles({ locale, t }: { locale: Locale; t: HomeCopy["routes"] }) {
  // `bg-current/10` is not a Tailwind utility, so each tile names its own
  // tint from the palette rather than deriving one from currentColor.
  const tiles = [
    {
      href: localePath(locale, "/residential"),
      accent: "text-brand-green-ink",
      hover: "hover:border-brand-green",
      iconBg: "bg-brand-green-tint",
    },
    {
      href: localePath(locale, "/commercial-and-industrial"),
      accent: "text-brand-orange-ink",
      hover: "hover:border-brand-orange",
      iconBg: "bg-brand-orange-tint",
    },
    {
      href: localePath(locale, "/atap"),
      accent: "text-brand-green-deep",
      hover: "hover:border-brand-green",
      iconBg: "bg-brand-green-tint",
    },
    {
      href: localePath(locale, "/bess"),
      accent: "text-brand-orange-deep",
      hover: "hover:border-brand-orange",
      iconBg: "bg-brand-orange-tint",
    },
  ];

  return (
    <section id="routes" className="scroll-mt-20 bg-base-bg py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="max-w-2xl">
          <SectionTag>{t.eyebrow}</SectionTag>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-base-ink sm:text-3xl">{t.title}</h2>
        </ScrollReveal>

        <ScrollReveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.items.map((item, i) => (
            <article
              key={item.title}
              className={`relative grid content-start gap-2 rounded-2xl border border-base-line bg-base-panel p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_44px_-30px_rgba(8,26,15,0.5)] ${tiles[i].hover} ${tiles[i].accent}`}
            >
              <span
                aria-hidden
                className={`mb-1 grid h-9 w-9 place-items-center rounded-xl ${tiles[i].iconBg}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                >
                  {ICONS[i]}
                </svg>
              </span>
              <h3 className="text-base font-bold tracking-tight text-base-ink">
                <Link href={tiles[i].href} className="after:absolute after:inset-0">
                  {item.title}
                </Link>
              </h3>
              <p className="text-[13px] leading-snug text-base-slate">{item.body}</p>
            </article>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
