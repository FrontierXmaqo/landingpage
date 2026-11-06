/**
 * The WhatsApp message a lead sends after a lead form (residential, C&I, EV): the form's answers
 * as "Label: value" lines (residential adds "Referred by: <name>" when a salesman was picked;
 * respond.io's AI Agent assigns the chat on it), and the lead's ref id hidden right after "Hi" as zero-width
 * characters, so Make can match the chat to the Lark row without the customer seeing a code.
 * Labels stay in English in every language, so the sales team and respond.io read one format.
 */

/** respond.io's WhatsApp number. */
export const WHATSAPP_NUMBER = "60187771095";

/** sessionStorage key the form saves the wa.me link under for the thank-you page. */
export const WHATSAPP_HANDOFF_KEY = "maqo_whatsapp_link";

// No 0/O/1/I, so the id reads cleanly in Lark; always a mix of letters and digits.
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const DIGITS = "23456789";
const REF_CHARS = LETTERS + DIGITS;
export const REF_ID_PATTERN = /^MQ-[A-HJ-NP-Z2-9]{6}$/;

export function newRefId(): string {
  const r = crypto.getRandomValues(new Uint8Array(8));
  const out = Array.from(r.slice(0, 6), (b) => REF_CHARS[b % REF_CHARS.length]);
  const s = out.join("");
  if (!/\d/.test(s)) out[r[6] % 6] = DIGITS[r[7] % DIGITS.length];
  else if (!/[A-Z]/.test(s)) out[r[6] % 6] = LETTERS[r[7] % LETTERS.length];
  return "MQ-" + out.join("");
}

/** Each of the 6 characters after "MQ-" as its 5-bit index in REF_CHARS: U+200B for 0, U+200C for 1. */
function hiddenRef(refId: string): string {
  return refId
    .slice(3)
    .split("")
    .map((c) => REF_CHARS.indexOf(c).toString(2).padStart(5, "0").replace(/0/g, "​").replace(/1/g, "‌"))
    .join("");
}

/** [label in the message, form field name]; optional fields are left out when empty. */
export type WhatsAppField = readonly [label: string, name: string, optional?: boolean];

/** The message from what's in `form` now (all "-" before the form exists). */
export function whatsappLeadText(form: HTMLFormElement | null, fields: readonly WhatsAppField[], refId = ""): string {
  const data = form ? new FormData(form) : null;
  const lines = [`Hi${hiddenRef(refId)} Maqo Solar, I'd like a free solar quotation. My details:`];
  for (const [label, name, optional] of fields) {
    const value = String(data?.get(name) ?? "");
    if (value || !optional) lines.push(`${label}: ${value || "-"}`);
  }
  return lines.join("\n");
}

export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
