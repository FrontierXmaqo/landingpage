"use server";

import { getSupabaseServerClient } from "@/lib/supabase";
import { buildLeadWebhookPayload } from "@/lib/leadWebhookTemplate";

export type LeadFormState = { status: "idle" | "success" | "error"; message?: string };

const MAX_FIELD_LENGTH = 200;

function clean(value: FormDataEntryValue | null, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "").trim().slice(0, maxLength);
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
  const salutation = clean(formData.get("salutation"), 10);
  const full_name = clean(formData.get("full_name"));
  const phone = clean(formData.get("phone"), 30);
  const email = clean(formData.get("email"));
  const state = clean(formData.get("state"), 50);
  const monthly_bill_range = clean(formData.get("monthly_bill_range"), 50);
  const property_type = clean(formData.get("property_type"), 80);
  const electric_supply = clean(formData.get("electric_supply"), 30);
  const preferred_language = clean(formData.get("preferred_language"), 30);
  const campaign_id = clean(formData.get("campaign_id"), 100);
  const landing_referrer = clean(formData.get("landing_referrer"), 500);

  // Honeypot: real visitors never fill this hidden field.
  if (clean(formData.get("company_website"))) {
    return { status: "success", message: "Thanks! Our ATAP team will call you within 1 business day." };
  }

  if (!full_name || !phone) {
    return { status: "error", message: "Please fill in your name and phone number." };
  }

  const emailLooksValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
  });

  if (!supabaseOk) {
    return { status: "error", message: "Something went wrong submitting your assessment. Please WhatsApp us instead." };
  }

  return { status: "success", message: "Thanks! Our ATAP team will call you within 1 business day." };
}
