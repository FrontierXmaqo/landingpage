import type { Locale } from "@/lib/i18n";
import type { LeadFormPage, PublishedCustomField } from "@/lib/publishedContent";

/**
 * Every lead form saves the lead (Supabase + Lark), then sends the visitor to
 * this WhatsApp number with their details typed in, so the chat starts in
 * respond.io. The form's thank-you page opens it (after the lead conversion
 * fires); the message is handed over in sessionStorage under WHATSAPP_TEXT_KEY.
 */
export const WHATSAPP_NUMBER = "60187771095";
export const WHATSAPP_TEXT_KEY = "maqo_whatsapp_text";

const INTRO: Record<LeadFormPage, string> = {
  main: "Hi MAQO, I'd like a free solar home assessment.",
  ev: "Hi MAQO, I'd like a free solar assessment for my home and EV.",
  ci: "Hi MAQO, I'd like a free commercial solar assessment.",
};

const PAGE_NAME: Record<LeadFormPage, string> = {
  main: "Residential",
  ev: "EV",
  ci: "C&I",
};

// [label, form field name]. Labels stay in English: the sales team reads them in respond.io.
const LINES: Record<LeadFormPage, [string, string][]> = {
  main: [
    ["Name", "full_name"],
    ["Phone", "phone"],
    ["Email", "email"],
    ["Location", "state"],
    ["Monthly TNB bill", "monthly_bill_range"],
    ["Property type", "property_type"],
    ["Electric supply", "electric_supply"],
    ["Preferred language", "preferred_language"],
  ],
  ev: [
    ["Name", "full_name"],
    ["Phone", "phone"],
    ["Email", "email"],
    ["Location", "state"],
    ["Monthly TNB bill", "monthly_bill_range"],
    ["Property type", "property_type"],
    ["Electric supply", "electric_supply"],
    ["Preferred language", "preferred_language"],
    ["Usually charges EV", "charge_time"],
  ],
  ci: [
    ["Name", "full_name"],
    ["Company", "company_name"],
    ["Role", "role_in_organization"],
    ["Industry", "industry"],
    ["Phone", "phone"],
    ["Email", "email"],
    ["Location", "state"],
    ["Monthly electric bill", "monthly_bill_range"],
  ],
};

/**
 * The message the visitor sends us. Built by submitLead from the checked values
 * (so it matches what was saved) and by the form's live preview from what is
 * typed so far; an empty field shows as "-".
 */
export function whatsappMessage(
  page: LeadFormPage,
  values: Record<string, string>,
  customFields: Pick<PublishedCustomField, "key" | "label">[] = [],
): string {
  const v = (key: string) => (values[key] ?? "").trim();
  const lines = [INTRO[page]];
  for (const [label, key] of LINES[page]) {
    const value = key === "full_name" ? [v("salutation"), v("full_name")].filter(Boolean).join(" ") : v(key);
    lines.push(`${label}: ${value || "-"}`);
  }
  for (const f of customFields) {
    if (!LINES[page].some(([, key]) => key === f.key)) lines.push(`${f.label}: ${v(f.key) || "-"}`);
  }
  if (page === "main" && v("referred")) {
    lines.push(`Referred by salesman: ${v("referred") === "yes" ? v("salesman") || "-" : "No"}`);
  }
  lines.push(`Page: get.maqo.asia ${PAGE_NAME[page]}`);
  return lines.join("\n");
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Visitor-facing text around the WhatsApp step, in each site language. */
export const WHATSAPP_COPY: Record<
  Locale,
  { submit: string; sending: string; note: string; preview: string; opening: string; open: string }
> = {
  en: {
    submit: "Submit via WhatsApp",
    sending: "Sending…",
    note: "WhatsApp will open with your details filled in. Press Send to reach us.",
    preview: "Message that will be sent",
    opening: "Opening WhatsApp with your details. Press Send to reach our team.",
    open: "Open WhatsApp",
  },
  ms: {
    submit: "Hantar melalui WhatsApp",
    sending: "Menghantar…",
    note: "WhatsApp akan dibuka dengan butiran anda. Tekan Hantar untuk menghubungi kami.",
    preview: "Mesej yang akan dihantar",
    opening: "Membuka WhatsApp dengan butiran anda. Tekan Hantar untuk menghubungi pasukan kami.",
    open: "Buka WhatsApp",
  },
  cn: {
    submit: "通过 WhatsApp 提交",
    sending: "提交中…",
    note: "WhatsApp 将自动打开并填好您的资料，按发送即可联系我们。",
    preview: "将发送的信息",
    opening: "正在打开 WhatsApp 并填好您的资料，按发送即可联系我们的团队。",
    open: "打开 WhatsApp",
  },
};

/** Browser only. Keeps the message for the thank-you page, which opens WhatsApp. */
export function rememberWhatsappText(text: string | undefined) {
  if (!text) return;
  try {
    sessionStorage.setItem(WHATSAPP_TEXT_KEY, text);
  } catch {
    // storage blocked: the thank-you page then just shows no WhatsApp step
  }
}

/** Browser only. The message the form left for this thank-you page, or "". */
export function readWhatsappText(): string {
  try {
    return sessionStorage.getItem(WHATSAPP_TEXT_KEY) || "";
  } catch {
    return "";
  }
}

/** Browser only. Opens WhatsApp and drops the message, so a later refresh of the thank-you page doesn't reopen it. */
export function openWhatsapp(text: string) {
  try {
    sessionStorage.removeItem(WHATSAPP_TEXT_KEY);
  } catch {
    // storage blocked: nothing was kept
  }
  window.location.href = whatsappUrl(text);
}
