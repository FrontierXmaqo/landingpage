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

export type LeadFormState = { status: "idle" | "success" | "error"; message?: string };

const MAX_FIELD_LENGTH = 200;
const GENERIC_ERROR = "Something went wrong submitting your assessment. Please WhatsApp us instead.";
const PHONE_PATTERN = /^\+?[0-9 -]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: FormDataEntryValue | null, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "").trim().slice(0, maxLength);
}

function oneOf(value: string, allowed: readonly string[]) {
  return allowed.includes(value) ? value : "";
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

export async function submitLead(_prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const clientIp = await getClientIp();

  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return { status: "error", message: "Too many requests. Please try again in a minute." };
  }

  // Honeypot: real visitors never fill this hidden field.
  if (clean(formData.get("company_website"))) {
    return { status: "success", message: "Thanks! Our ATAP team will call you within 1 business day." };
  }

  const salutation = oneOf(clean(formData.get("salutation"), 10), SALUTATIONS);
  const full_name = clean(formData.get("full_name")).replace(/[\p{Cc}\p{Cf}]/gu, "");
  const phoneRaw = clean(formData.get("phone"), 30);
  const email = clean(formData.get("email"));
  const state = oneOf(clean(formData.get("state"), 50), MALAYSIAN_STATES);
  const monthly_bill_range = oneOf(clean(formData.get("monthly_bill_range"), 50), BILL_RANGES);
  const property_type = oneOf(clean(formData.get("property_type"), 80), PROPERTY_TYPES);
  const electric_supply = oneOf(clean(formData.get("electric_supply"), 30), ELECTRIC_SUPPLY_OPTIONS);
  const preferred_language = oneOf(clean(formData.get("preferred_language"), 30), COMMUNICATION_LANGUAGES);
  const campaign_id = clean(formData.get("campaign_id"), 100);
  const landing_referrer = clean(formData.get("landing_referrer"), 500);
  const turnstileToken = clean(formData.get("cf-turnstile-response"), 2000);

  if (!full_name || !PHONE_PATTERN.test(phoneRaw)) {
    return { status: "error", message: "Please fill in your name and a valid phone number." };
  }
  const phone = phoneRaw;

  const emailLooksValid = !email || EMAIL_PATTERN.test(email);

  const turnstileOk = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!turnstileOk) {
    return { status: "error", message: "We couldn't verify you're human. Please try again." };
  }

  let supabaseOk = true;
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("atap_leads").insert({
      full_name, phone, email: emailLooksValid && email ? email : null, state: state || null,
      monthly_bill_range: monthly_bill_range || null, property_type: property_type || null,
      electric_supply: electric_supply || null, preferred_language: preferred_language || null,
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
    phone,
    email: emailLooksValid ? email : "",
    state,
    monthlyBillRange: monthly_bill_range,
    propertyType: property_type,
    electricSupply: electric_supply,
    preferredLanguage: preferred_language,
    sourceOfLeads: landing_referrer,
    campaignId: campaign_id,
    sourcePage: "MAQO Main Site",
  });

  if (!supabaseOk) {
    return { status: "error", message: GENERIC_ERROR };
  }

  return { status: "success", message: "Thanks! Our ATAP team will call you within 1 business day." };
}
