import Image from "next/image";
import type { Dictionary } from "@/lib/i18n";

/**
 * The certification marks, sitting directly under the hero.
 *
 * Depth here is deliberately restrained: a certification mark loses authority
 * the moment it looks like a game asset. Each badge is a pale plinth carrying
 * a layered shadow and a one-pixel top highlight, so it reads as a physical
 * medallion resting on the page rather than an image pasted onto it. The lift
 * on hover is a few pixels and a degree of tilt — enough to feel solid, not
 * enough to distract from the enquiry form above it.
 */
/** An issued mark. The artwork is never restyled — only the plinth carries depth. */
type Badge = { src: string; alt: string; caption: string };

const CIDB: Badge = {
  src: "/logos/credentials/cidb-g7.png",
  alt: "CIDB Malaysia Grade G7 certification",
  caption: "CIDB G7",
};
const ISO: Badge = {
  src: "/logos/credentials/cpg-iso-9001.png",
  alt: "Certification Partner Global ISO 9001:2015 certified company",
  caption: "ISO 9001:2015 certified",
};
const SEDA: Badge = {
  src: "/logos/credentials/seda-pvms.png",
  alt: "SEDA registered PV monitoring system",
  caption: "SEDA registered installer",
};
const ST_CLASS_A: Badge = {
  src: "/logos/credentials/suruhanjaya-tenaga.png",
  alt: "Suruhanjaya Tenaga Class A electrical contractor licence",
  caption: "EC Class A",
};

/** The C&I audience buys on the electrical licence, so that page leads with it. */
const SETS = {
  residential: [CIDB, ISO, SEDA],
  commercial: [ST_CLASS_A, CIDB, ISO, SEDA],
} as const;

export default function CredentialBadges({
  t,
  set = "residential",
  inline = false,
}: {
  t: Dictionary["credentialBadges"];
  set?: keyof typeof SETS;
  /** Inside a hero column: no band, no heading, and marks sized to fit beside
   *  an enquiry form. The standalone band keeps its own heading and scale. */
  inline?: boolean;
}) {
  const badges = SETS[set];
  const markSize = "h-20 sm:h-24";

  const list = (
    <ul
      className={`grid justify-items-center ${
        inline ? "grid-cols-2 gap-3 sm:grid-cols-4" : "mt-6 grid-cols-2 gap-4 sm:gap-6"
      } ${!inline && badges.length === 4 ? "sm:grid-cols-4" : ""} ${
        !inline && badges.length === 3 ? "sm:grid-cols-3" : ""
      }`}
    >
      {badges.map((badge) => (
        <li key={badge.src} className="credential-plinth group">
          <div className={`credential-plinth-face ${inline ? "px-3 py-3" : ""}`}>
            <Image
              src={badge.src}
              alt={badge.alt}
              width={220}
              height={220}
              className={`${markSize} w-auto max-w-full object-contain`}
            />
          </div>
          <p className={`text-center text-base-ink ${inline ? "mt-2 text-sm leading-snug" : "mt-3 text-base sm:text-lg"}`}>
            {badge.caption}
          </p>
        </li>
      ))}
    </ul>
  );

  if (inline) return <div className="max-w-xl">{list}</div>;

  return (
    <section
      className="border-b border-base-line bg-base-bg pb-10 pt-6 sm:pb-12 sm:pt-8"
      aria-labelledby="credentials-heading"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="credentials-heading"
          className="section-eyebrow text-center text-xs font-semibold uppercase text-base-slate"
        >
          {t.title}
        </h2>
        {list}
      </div>
    </section>
  );
}
