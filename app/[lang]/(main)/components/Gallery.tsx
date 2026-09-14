import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { OLD_SITE_IMAGES } from "@/lib/content";
import { fill, type Dictionary } from "@/lib/i18n";

export default function Gallery({ t }: { t: Dictionary["gallery"] }) {
  return (
    <section className="bg-base-bg py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {OLD_SITE_IMAGES.gallery.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square overflow-hidden rounded-xl border border-base-line bg-base-panel"
            >
              <Image
                src={src}
                alt={fill(t.imageAlt, { n: i + 1 })}
                fill
                className="object-cover transition duration-300 hover:scale-105"
                sizes="(min-width: 640px) 25vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
