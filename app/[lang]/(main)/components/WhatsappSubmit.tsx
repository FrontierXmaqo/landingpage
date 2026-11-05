"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { LeadFormPage, PublishedCustomField } from "@/lib/publishedContent";
import { WHATSAPP_COPY, openWhatsapp, readWhatsappText, whatsappMessage, whatsappUrl } from "@/lib/whatsapp";

// Neutral greys over whatever the page's palette is, so this fits the main, C&I and EV themes alike.
const PREVIEW_BOX: React.CSSProperties = {
  margin: "8px 0 0",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,.12)",
  background: "rgba(0,0,0,.035)",
  font: "12.5px/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  textAlign: "left",
};

export function WhatsappIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

/**
 * Under a lead form's submit button: what happens next, and a live preview of
 * the WhatsApp message built from what the visitor has filled in so far.
 */
export function WhatsappPreview({
  page,
  locale,
  customFields,
}: {
  page: LeadFormPage;
  locale: Locale;
  customFields?: PublishedCustomField[];
}) {
  const t = WHATSAPP_COPY[locale];
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(() => whatsappMessage(page, {}, customFields));

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;
    const refresh = () => {
      const values: Record<string, string> = {};
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") values[key] = value;
      });
      setText(whatsappMessage(page, values, customFields));
    };
    refresh();
    form.addEventListener("input", refresh);
    form.addEventListener("change", refresh);
    return () => {
      form.removeEventListener("input", refresh);
      form.removeEventListener("change", refresh);
    };
  }, [page, customFields]);

  return (
    <div ref={ref} style={{ fontSize: 13, lineHeight: 1.5 }}>
      <p style={{ margin: 0, textAlign: "center", opacity: 0.8 }}>{t.note}</p>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px dashed rgba(0,0,0,.18)" }}>
        <p style={{ margin: 0, fontWeight: 600, opacity: 0.85 }}>{t.preview}</p>
        <pre style={PREVIEW_BOX} aria-live="polite">{text}</pre>
      </div>
    </div>
  );
}

/**
 * On a thank-you page: opens WhatsApp with the message the form left behind.
 * Waits a moment first so the page's lead conversion (ThankYouTracking) is sent
 * before the visitor leaves; the button covers browsers that block the redirect.
 */
export function WhatsappContinue({ locale }: { locale: Locale }) {
  const t = WHATSAPP_COPY[locale];
  const [text, setText] = useState("");

  useEffect(() => {
    // Read, not taken: React may run this effect twice, and the second run must still find it.
    const stored = readWhatsappText();
    if (!stored) return;
    // sessionStorage doesn't exist during the server render, so it's read after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(stored);
    const timer = setTimeout(() => openWhatsapp(stored), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!text) return null;
  return (
    <div style={{ marginTop: 28, display: "grid", justifyItems: "center", gap: 12, textAlign: "center" }} role="status">
      <p style={{ margin: 0, maxWidth: 420, fontWeight: 600 }}>{t.opening}</p>
      <a
        href={whatsappUrl(text)}
        onClick={(e) => {
          e.preventDefault();
          openWhatsapp(text);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 22px",
          borderRadius: 999,
          fontWeight: 700,
          textDecoration: "none",
          border: "2px solid currentColor",
          color: "inherit",
        }}
      >
        <WhatsappIcon />
        {t.open}
      </a>
    </div>
  );
}
