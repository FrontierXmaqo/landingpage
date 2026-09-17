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
const BADGES: { src: string; alt: string; caption: string }[] = [
  {
    src: "/logos/credentials/cidb-g7.png",
    alt: "CIDB Malaysia Grade G7 certification",
    caption: "Highest construction grade",
  },
  {
    src: "/logos/credentials/iso-9001.webp",
    alt: "ISO 9001:2015 certified company",
    caption: "Quality management certified",
  },
  {
    src: "/logos/credentials/seda-pvms.png",
    alt: "SEDA registered PV monitoring system",
    caption: "SEDA registered installer",
  },
];

export default function CredentialBadges({ t }: { t: Dictionary["credentialBadges"] }) {
  return (
    <section className="border-b border-base-line bg-base-bg py-12 sm:py-16" aria-labelledby="credentials-heading">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2
          id="credentials-heading"
          className="section-eyebrow text-center text-xs font-semibold uppercase text-base-slate"
        >
          {t.title}
        </h2>

        <ul className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-3 sm:gap-8">
          {BADGES.map((badge) => (
            <li key={badge.src} className="credential-plinth group">
              <div className="credential-plinth-face">
                <Image
                  src={badge.src}
                  alt={badge.alt}
                  width={220}
                  height={220}
                  className="h-20 w-auto max-w-full object-contain sm:h-24"
                />
              </div>
              <p className="mt-4 text-center text-sm font-medium text-base-slate">{badge.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
