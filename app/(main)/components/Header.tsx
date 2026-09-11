import Image from "next/image";
import { OLD_SITE_IMAGES } from "@/lib/content";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-base-line bg-base-panel/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="relative h-9 w-32 sm:h-10 sm:w-36">
          <Image
            src={OLD_SITE_IMAGES.logo}
            alt="MAQO Solar"
            fill
            className="object-contain object-left"
            sizes="160px"
            priority
          />
        </div>
        <a
          href="#assessment"
          className="inline-flex items-center rounded-full bg-brand-orange-deep px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
        >
          Free Assessment
        </a>
      </div>
    </header>
  );
}
