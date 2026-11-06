"use client";

import { useRef, useState } from "react";
import { newRefId, whatsappLeadText, whatsappLink, WHATSAPP_HANDOFF_KEY, type WhatsAppField } from "@/lib/whatsappLead";

/**
 * Wires a lead form to WhatsApp: a live preview of the message, and on submit a fresh ref id in
 * the form's hidden ref_id input and WhatsApp opened in a new tab (or, if the browser blocks that,
 * the link saved for the thank-you page's WhatsAppHandoff). React reads the form after onSubmit.
 */
export function useWhatsAppLead(fields: readonly WhatsAppField[]) {
  const formRef = useRef<HTMLFormElement>(null);
  const refIdRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(() => whatsappLeadText(null, fields));
  return {
    formRef,
    refIdRef,
    preview,
    // After the change has landed (React re-renders fields that depend on it).
    onChange: () => setTimeout(() => setPreview(whatsappLeadText(formRef.current, fields))),
    onSubmit: () => {
      const refId = newRefId();
      if (refIdRef.current) refIdRef.current.value = refId;
      const link = whatsappLink(whatsappLeadText(formRef.current, fields, refId));
      // Opened now, inside the tap: phones block opening the WhatsApp app seconds later, after the
      // save and the thank-you page. This tab still saves the lead and loads the thank-you page.
      const tab = window.open(link, "_blank");
      if (tab) {
        tab.opener = null;
        return;
      }
      try {
        // Blocked anyway: the thank-you page opens WhatsApp itself and shows a button.
        sessionStorage.setItem(WHATSAPP_HANDOFF_KEY, link);
      } catch {
        // storage blocked: no WhatsApp step at all
      }
    },
  };
}

/** Under the submit button. Inline styles, so it also works on the EV page's own stylesheet. */
export default function WhatsAppPreview({ text, title, note }: { text: string; title: string; note: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem", fontSize: "0.875rem", color: "#5b6660" }}>
      <p style={{ margin: 0, textAlign: "center" }}>{note}</p>
      <div style={{ borderTop: "1px dashed #d6dbd7", paddingTop: "1rem" }}>
        <p style={{ margin: 0, fontWeight: 600, color: "#1d2420" }}>{title}</p>
        <pre
          aria-live="polite"
          style={{ margin: "0.5rem 0 0", whiteSpace: "pre-wrap", overflowWrap: "anywhere", borderRadius: "0.75rem", border: "1px solid #d6dbd7", background: "#f6f7f5", padding: "1rem", fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: "13px", lineHeight: 1.6, color: "#1d2420" }}
        >
          {text}
        </pre>
      </div>
    </div>
  );
}
