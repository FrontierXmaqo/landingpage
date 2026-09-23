import { SOCIALS } from "@/lib/content";

/**
 * MAQO's social profiles, drawn rather than imported so the row costs no
 * extra request and inherits its colour from whatever footer it sits in.
 *
 * Each icon is the platform's own mark; the accessible name is on the link,
 * not the glyph, so a screen reader announces "MAQO Solar on Instagram"
 * rather than reading a path.
 */
const ICONS: Record<(typeof SOCIALS)[number]["name"], React.ReactNode> = {
  Facebook: (
    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12" />
  ),
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.3" cy="6.7" r="1.1" />
    </>
  ),
  LinkedIn: (
    <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M3 9h4v12H3zm7 0h3.8v1.64h.05A4.17 4.17 0 0 1 17.6 8.7c4 0 4.4 2.5 4.4 5.76V21h-4v-5.66c0-1.35-.03-3.08-1.9-3.08-1.9 0-2.2 1.47-2.2 2.98V21h-3.9z" />
  ),
  TikTok: (
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.25 0 .5.04.74.11v-3.1a5.69 5.69 0 0 0-.74-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.25-1.48" />
  ),
};

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {SOCIALS.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`MAQO Solar on ${social.name}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-base-line text-base-slate transition hover:border-base-ink hover:bg-base-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green-ink"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
              {ICONS[social.name]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
