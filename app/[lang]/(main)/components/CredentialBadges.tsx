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
type Badge =
  /** An issued mark. The artwork is never restyled — only the plinth carries depth. */
  | { src: string; alt: string; caption: string }
  /** A credential with no supplied artwork, set as type on the same plinth. */
  | { mark: string; issuer: string; caption: string };

const CIDB: Badge = {
  src: "/logos/credentials/cidb-g7.png",
  alt: "CIDB Malaysia Grade G7 certification",
  caption: "Highest construction grade",
};
const ISO: Badge = {
  src: "/logos/credentials/iso-9001.webp",
  alt: "ISO 9001:2015 certified company",
  caption: "Quality management certified",
};
const SEDA: Badge = {
  src: "/logos/credentials/seda-pvms.png",
  alt: "SEDA registered PV monitoring system",
  caption: "SEDA registered installer",
};
const ST_CLASS_A: Badge = {
  mark: "Class A",
  issuer: "Suruhanjaya Tenaga",
  caption: "Highest electrical grade",
};

/** The C&I audience buys on the electrical licence, so that page leads with it. */
const SETS = {
  residential: [CIDB, ISO, SEDA],
  commercial: [ST_CLASS_A, CIDB, ISO, SEDA],
} as const;

export default function CredentialBadges({
  t,
  set = "residential",
}: {
  t: Dictionary["credentialBadges"];
  set?: keyof typeof SETS;
}) {
  const badges = SETS[set];

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

        <ul
          className={`mt-6 grid grid-cols-2 justify-items-center gap-4 sm:gap-6 ${
            badges.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"
          }`}
        >
          {badges.map((badge) => (
            <li key={"src" in badge ? badge.src : badge.mark} className="credential-plinth group">
              <div className="credential-plinth-face">
                {"src" in badge ? (
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={220}
                    height={220}
                    className="h-16 w-auto max-w-full object-contain sm:h-20"
                  />
                ) : (
                  <span className="flex h-16 flex-col items-center justify-center text-center sm:h-20">
                    <span className="text-2xl font-bold leading-none text-brand-green-ink">{badge.mark}</span>
                    <span className="mt-1.5 text-[11px] uppercase tracking-wider text-base-slate">
                      {badge.issuer}
                    </span>
                  </span>
                )}
              </div>
              <p className="mt-3 text-center text-xs text-base-slate sm:text-sm">{badge.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
