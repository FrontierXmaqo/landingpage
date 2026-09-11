import { CONTACT } from "@/lib/content";

export default function WhatsAppButton() {
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MAQO Solar on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maqo-green text-white shadow-lg transition hover:bg-maqo-green-dark"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden>
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.3.63 4.45 1.73 6.3L4 29l7.86-1.7a12.9 12.9 0 0 0 4.16.7C22.6 28 28 22.6 28 15.98 28 9.4 22.6 4 16.02 3zm7.4 18.15c-.32.9-1.6 1.65-2.6 1.86-.7.15-1.6.27-4.66-1-3.9-1.6-6.4-5.55-6.6-5.8-.19-.26-1.58-2.1-1.58-4 0-1.9.98-2.83 1.33-3.22.35-.38.76-.48 1.02-.48h.73c.23 0 .55-.09.86.66.32.77 1.09 2.66 1.18 2.85.1.19.16.42.03.68-.13.26-.2.42-.4.65-.2.23-.42.51-.6.68-.2.19-.4.4-.18.79.23.4 1 1.64 2.14 2.66 1.47 1.31 2.7 1.72 3.1 1.91.4.19.63.16.87-.1.23-.26 1-1.16 1.26-1.56.26-.4.52-.33.87-.2.35.13 2.24 1.06 2.63 1.25.4.19.65.29.75.45.1.16.1.94-.22 1.85z" />
      </svg>
    </a>
  );
}
