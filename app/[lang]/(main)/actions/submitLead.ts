"use server";

import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase";
import { buildLeadWebhookPayload } from "@/lib/leadWebhookTemplate";
import { checkRateLimit } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
} from "@/lib/leadFormOptions";
import { getPublishedLeadFormFields, getPublishedLeadFormOptions, type LeadFormPage } from "@/lib/publishedContent";
import { getDictionary, hasLocale, DEFAULT_LOCALE } from "@/lib/i18n";

export type LeadFormState = { status: "idle" | "success" | "error"; message?: string };

const MAX_FIELD_LENGTH = 200;
const PHONE_PATTERN = /^\+?[0-9 -]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: FormDataEntryValue | null, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "").trim().slice(0, maxLength);
}

function oneOf(value: string, allowed: readonly string[]) {
  return allowed.includes(value) ? value : "";
}

/** Rough Google-vs-social split for the Performance Analytics dashboard, from the referrer already captured. */
function classifyLeadSource(referrer: string): "google" | "social" | "direct" {
  const r = referrer.toLowerCase();
  if (r.includes("google")) return "google";
  if (r.includes("facebook") || r.includes("instagram") || r.includes("fb.com") || r.includes("l.instagram")) return "social";
  return "direct";
}

/** Normalizes a Malaysian mobile number to WhatsApp's plain digit format (e.g. "601297726574") — no "+", no spaces/dashes. */
function toWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("60")) return digits;
  if (digits.startsWith("0")) return "60" + digits.slice(1);
  return "60" + digits;
}

async function getClientIp() {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

async function forwardToWebhook(input: Parameters<typeof buildLeadWebhookPayload>[0]) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  if (!webhookUrl) return;
  if (!webhookUrl.startsWith("https://")) {
    console.error("LEAD_WEBHOOK_URL is not an https:// URL; refusing to send.");
    return;
  }

  const payload = buildLeadWebhookPayload(input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.error("Lead webhook responded with", res.status);
    }
  } catch (err) {
    console.error("Lead webhook request failed", err);
  } finally {
    clearTimeout(timeout);
  }
}

export async function submitLead(sourcePage: string, formPage: LeadFormPage, _prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const localeRaw = clean(formData.get("locale"), 5);
  const t = getDictionary(hasLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE).leadMessages;
  const clientIp = await getClientIp();

  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return { status: "error", message: t.rateLimited };
  }

  // Honeypot: real visitors never fill this hidden field.
  if (clean(formData.get("company_website"))) {
    return { status: "success", message: t.success };
  }

  // Each core field is validated against this page's own published CMS
  // options, falling back to the hardcoded list when the CMS has none — same
  // fallback LeadForm.tsx renders with, so a value the visitor was actually
  // offered never gets silently dropped for not matching a different page's
  // list (e.g. C&I's "Below RM5,000" bill bands vs the residential RM200–900
  // ladder that used to be the only allowlist every page validated against).
  const [pageOptions, customFields] = await Promise.all([
    getPublishedLeadFormOptions(formPage),
    getPublishedLeadFormFields(formPage),
  ]);
  const salutationOptions = pageOptions.salutations?.length ? pageOptions.salutations : SALUTATIONS;
  const stateOptions = pageOptions.states?.length ? pageOptions.states : MALAYSIAN_STATES;
  const billRangeOptions = pageOptions.billRanges?.length ? pageOptions.billRanges : BILL_RANGES;
  const propertyTypeOptions = pageOptions.propertyTypes?.length ? pageOptions.propertyTypes : PROPERTY_TYPES;
  const electricSupplyOptions = pageOptions.electricSupply?.length ? pageOptions.electricSupply : ELECTRIC_SUPPLY_OPTIONS;
  const languageOptions = pageOptions.languages?.length ? pageOptions.languages : COMMUNICATION_LANGUAGES;

  const salutation = oneOf(clean(formData.get("salutation"), 10), salutationOptions);
  const full_name = clean(formData.get("full_name")).replace(/[\p{Cc}\p{Cf}]/gu, "");
  const company_name = clean(formData.get("company_name"), 150);
  const phoneRaw = clean(formData.get("phone"), 30);
  const email = clean(formData.get("email"));
  const state = oneOf(clean(formData.get("state"), 50), stateOptions);
  // Optional, and silently dropped if malformed — a mistyped postcode must
  // never cost a lead. lib/postcode.ts turns it into district and town at
  // read time, so nothing derived is frozen into the row.
  const postcodeRaw = clean(formData.get("postcode"), 10).replace(/\D/g, "");
  const postcode = /^[0-9]{5}$/.test(postcodeRaw) ? postcodeRaw : "";
  const monthly_bill_range = oneOf(clean(formData.get("monthly_bill_range"), 50), billRangeOptions);
  const property_type = oneOf(clean(formData.get("property_type"), 80), propertyTypeOptions);
  const electric_supply = oneOf(clean(formData.get("electric_supply"), 30), electricSupplyOptions);
  const preferred_language = oneOf(clean(formData.get("preferred_language"), 30), languageOptions);
  const campaign_id = clean(formData.get("campaign_id"), 100);
  const gclid = clean(formData.get("gclid"), 100);
  const fbclid = clean(formData.get("fbclid"), 200);
  const landing_referrer = clean(formData.get("landing_referrer"), 500);
  const landing_page_source = clean(formData.get("landing_page_source"), 300);
  const charge_time = clean(formData.get("charge_time"), 80);
  const turnstileToken = clean(formData.get("cf-turnstile-response"), 2000);

  // Every field on the form is mandatory — mirrors the `required` attributes
  // client-side, but the server is the one that actually enforces it.
  if (
    !salutation ||
    !full_name ||
    !PHONE_PATTERN.test(phoneRaw) ||
    !EMAIL_PATTERN.test(email) ||
    !state ||
    !monthly_bill_range
  ) {
    return { status: "error", message: t.invalid };
  }
  if (formPage === "ci" && !company_name) {
    return { status: "error", message: t.invalid };
  }
  if (formPage !== "ci" && (!property_type || !electric_supply || !preferred_language)) {
    return { status: "error", message: t.invalid };
  }
  const phone = toWhatsAppNumber(phoneRaw);

  // Custom fields marketing added in the CMS (e.g. C&I's "Industry / sector"):
  // only ones currently published are trusted, and each value is pinned to
  // that field's own published option list — same allowlist discipline as the
  // core fields above. All of them are required, same as the built-in fields.
  const extraFields: Record<string, string> = {};
  for (const field of customFields) {
    const value = oneOf(clean(formData.get(field.key), 120), field.values);
    if (value) extraFields[field.key] = value;
  }
  if (customFields.some((f) => !extraFields[f.key])) {
    return { status: "error", message: t.invalid };
  }
  if (formPage === "ci" && !extraFields["industry"]) {
    return { status: "error", message: t.invalid };
  }
  const extraFieldsSummary = customFields
    .filter((f) => extraFields[f.key])
    .map((f) => `${f.label}: ${extraFields[f.key]}`);

  const turnstileOk = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!turnstileOk) {
    return { status: "error", message: t.captcha };
  }

  // C&I leads are commercial enquiries, not residential/EV ones — different
  // shape (a company, an industry, no property type or electric supply) and a
  // different sales workflow, so they get their own table rather than being
  // squeezed into atap_leads's residential/EV columns.
  let supabaseOk = true;
  try {
    const supabase = getSupabaseServerClient();
    const { industry: _industry, ...ciExtraFields } = extraFields;
    const { error } =
      formPage === "ci"
        ? await supabase.from("ci_leads").insert({
            full_name, company_name, industry: extraFields["industry"] || null,
            phone, email, state, postcode: postcode || null, monthly_bill_range,
            lead_source: classifyLeadSource(landing_referrer), campaign_id: campaign_id || null,
            extra_fields: ciExtraFields,
          })
        : await supabase.from("atap_leads").insert({
            // atap_leads holds both Residential and EV, and this form is the
            // only place that knows which. Rows written before the column
            // existed stay 'unknown' — no signal survived to recover them.
            segment: formPage === "ev" ? "ev" : "residential",
            full_name, phone, email, state, postcode: postcode || null,
            monthly_bill_range, property_type, electric_supply, preferred_language,
            lead_source: classifyLeadSource(landing_referrer), campaign_id: campaign_id || null,
            extra_fields: extraFields,
          });
    if (error) {
      console.error("Supabase insert error", error);
      supabaseOk = false;
    }
  } catch (err) {
    console.error(err);
    supabaseOk = false;
  }

  await forwardToWebhook({
    salutation,
    fullName: full_name,
    companyName: company_name,
    phone,
    email,
    state,
    postcode,
    monthlyBillRange: monthly_bill_range,
    propertyType: property_type,
    electricSupply: electric_supply,
    industry: extraFields["industry"] ?? "",
    preferredLanguage: preferred_language,
    sourceOfLeads: landing_referrer,
    campaignId: campaign_id,
    gclid,
    fbclid,
    sourcePage,
    remarks: [charge_time ? `Usually charges EV: ${charge_time}` : "", ...extraFieldsSummary].filter(Boolean).join(" | "),
    landingPageSource: landing_page_source,
  });

  if (!supabaseOk) {
    return { status: "error", message: t.generic };
  }

  return { status: "success", message: t.success };
}
