"use client";

import { useEffect, useSyncExternalStore } from "react";
import { WHATSAPP_HANDOFF_KEY } from "@/lib/whatsappLead";

const noSubscribe = () => () => {};

function savedLink() {
  try {
    const saved = sessionStorage.getItem(WHATSAPP_HANDOFF_KEY) || "";
    return saved.startsWith("https://wa.me/") ? saved : "";
  } catch {
    return ""; // storage blocked
  }
}

/**
 * After a residential lead lands on the thank-you page (where the conversion fires), opens
 * WhatsApp with the message the form saved, and keeps a button for when the phone blocks it.
 * Renders nothing when there's no saved message (e.g. the C&I or EV thank-you, or storage blocked).
 */
export default function WhatsAppHandoff({ t }: { t: { whatsappTitle: string; whatsappOpening: string; whatsappButton: string } }) {
  const link = useSyncExternalStore(noSubscribe, savedLink, () => "");

  useEffect(() => {
    if (!link) return;
    // A second for the conversion tags to send before the page is left.
    const timer = setTimeout(() => {
      try {
        sessionStorage.removeItem(WHATSAPP_HANDOFF_KEY); // a refresh doesn't open WhatsApp again
      } catch {}
      window.location.href = link;
    }, 1200);
    return () => clearTimeout(timer);
  }, [link]);

  if (!link) return null;
  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-base font-semibold text-base-ink">{t.whatsappTitle}</p>
      <a
        href={link}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#25d366] px-8 text-base font-bold text-white shadow-sm transition hover:brightness-95"
      >
        {t.whatsappButton}
      </a>
      <p className="text-sm text-base-slate" aria-live="polite">{t.whatsappOpening}</p>
    </div>
  );
}
