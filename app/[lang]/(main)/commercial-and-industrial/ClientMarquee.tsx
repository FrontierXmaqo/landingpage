import Image from "next/image";

export type Client = { name: string; logo?: string };

/**
 * Infinite horizontal scroll of the client roster.
 *
 * The track is the roster twice over and slides exactly half its width, so the
 * second copy lands where the first started and the loop is seamless. Pure CSS
 * — no JS, so it stays a server component — and it stops under
 * prefers-reduced-motion via .animate-marquee-clients.
 */
export default function ClientMarquee({ clients }: { clients: Client[] }) {
  const track = [...clients, ...clients];

  return (
    <div className="relative mt-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-base-panel to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-base-panel to-transparent sm:w-24" />
      <ul className="flex w-max animate-marquee-clients items-stretch">
        {track.map((client, i) => (
          <li
            key={`${client.name}-${i}`}
            aria-hidden={i >= clients.length}
            className="mx-1.5 flex h-20 w-44 shrink-0 items-center justify-center rounded-xl border border-base-line bg-base-bg px-4 text-center text-base font-semibold text-base-slate sm:mx-2 sm:w-52"
          >
            {client.logo ? (
              // Contained, not cropped: logos come in every aspect ratio, and
              // the name stays as the alt text so the tile still reads aloud.
              <Image
                src={client.logo}
                alt={client.name}
                width={160}
                height={56}
                className="max-h-12 w-auto object-contain"
                unoptimized
              />
            ) : (
              <span className="leading-tight">{client.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
