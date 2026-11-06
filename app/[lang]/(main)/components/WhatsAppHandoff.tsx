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
 * Renders nothing when there's no saved message (e.g. a direct visit, or storage blocked).
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
  // Inline styles, so it also works on the EV thank-you page's own stylesheet.
  return (
    <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <p style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#1d2420" }}>{t.whatsappTitle}</p>
      <a
        href={link}
        style={{ display: "inline-flex", minHeight: "3.5rem", alignItems: "center", justifyContent: "center", borderRadius: "0.75rem", background: "#25d366", padding: "0 2rem", fontSize: "1rem", fontWeight: 700, color: "#fff", textDecoration: "none" }}
      >
        {t.whatsappButton}
      </a>
      <p style={{ margin: 0, fontSize: "0.875rem", color: "#5b6660" }} aria-live="polite">{t.whatsappOpening}</p>
    </div>
  );
}
