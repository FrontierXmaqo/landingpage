/**
 * The WhatsApp message a lead sends after a lead form (residential, C&I, EV): the form's answers
 * as "Label: value" lines (residential adds "Referred by: <name>" when a salesman was picked;
 * respond.io's AI Agent assigns the chat on it), and the lead's ref id hidden right after "Hi" as zero-width
 * characters, so Make can match the chat to the Lark row without the customer seeing a code.
 * 3 more hidden bits after it carry the lead source (SOURCE_CODES), which Make writes to
 * respond.io's "Source of Leads" field.
 * Labels stay in English in every language, so the sales team and respond.io read one format.
 */

import { leadSource, type LeadSource } from "@/lib/leadSource";
import { findSalesperson } from "@/lib/salespeople";

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
    .map((c) => hiddenBits(REF_CHARS.indexOf(c), 5))
    .join("");
}

/** A lead source's position here is its 3-bit code after the hidden ref; Make decodes the same table. */
const SOURCE_CODES: readonly LeadSource[] = ["", "Instagram", "Facebook", "Threads", "Google", "Referral"];

function hiddenBits(n: number, width: number): string {
  return n.toString(2).padStart(width, "0").replace(/0/g, "​").replace(/1/g, "‌");
}

/** The form's lead source, the way submitLead works it out from the same fields. */
function formLeadSource(data: FormData): LeadSource {
  const get = (name: string) => String(data.get(name) ?? "");
  if (get("referred") === "yes" && findSalesperson(get("referred_by"))) return "Referral";
  return leadSource({ gclid: get("gclid"), utmSource: get("utm_source"), referrer: get("landing_referrer") });
}

/** [label in the message, form field name]; optional fields are left out when empty. */
export type WhatsAppField = readonly [label: string, name: string, optional?: boolean];

/** The message from what's in `form` now (all "-" before the form exists). */
export function whatsappLeadText(form: HTMLFormElement | null, fields: readonly WhatsAppField[], refId = ""): string {
  const data = form ? new FormData(form) : null;
  const hidden = refId ? hiddenRef(refId) + hiddenBits(SOURCE_CODES.indexOf(data ? formLeadSource(data) : ""), 3) : "";
  const lines = [`Hi${hidden} Maqo Solar, I'd like a free solar quotation. My details:`];
  for (const [label, name, optional] of fields) {
    const value = String(data?.get(name) ?? "");
    if (value || !optional) lines.push(`${label}: ${value || "-"}`);
  }
  return lines.join("\n");
}

export function whatsappLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
