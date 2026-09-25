"use server";

import { headers, cookies } from "next/headers";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { buildLeadWebhookPayload, buildCiLeadWebhookPayload } from "@/lib/leadWebhookTemplate";
import { checkRateLimit } from "@/lib/rateLimit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
  ROLE_IN_ORGANIZATION_OPTIONS,
} from "@/lib/leadFormOptions";
import { getPublishedLeadFormFields, getPublishedLeadFormOptions, type LeadFormPage } from "@/lib/publishedContent";
import { getDictionary, hasLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { isLeadFunnel, signLeadToken, THANK_YOU_FUNNELS } from "@/lib/leadToken";
import { toLeadPhone } from "@/lib/phone";

export type LeadFormState = { status: "idle" | "success" | "error"; message?: string };

const MAX_FIELD_LENGTH = 200;
// Starts with a letter or digit and uses only the characters real addresses
// do, so an "email" can't carry markup or a spreadsheet formula to the CRM.
const EMAIL_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._%+'-]*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/** Label sent to the CRM as the lead's source, keyed by funnel. Decided here,
 *  not taken from the client, which can post any value it likes. */
const SOURCE_PAGE: Record<LeadFormPage, string> = {
  main: "MAQO Main Site",
  ci: "MAQO C&I Landing Page",
  ev: "MAQO EV Landing Page",
};

/** Trimmed, length-capped, with control/format characters (CR/LF, tabs,
 *  zero-width and bidi marks) removed, so nothing can break lines or hide text
 *  in the CRM, WhatsApp templates or exports. */
function clean(value: FormDataEntryValue | null, maxLength = MAX_FIELD_LENGTH) {
  return String(value || "").replace(/[\p{Cc}\p{Cf}]/gu, "").trim().slice(0, maxLength);
}

/** Free text that ends up in CRM exports: a leading = + - @ would be run as a
 *  spreadsheet formula when someone opens the export, so it's escaped with '. */
function noFormula(value: string) {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

/** Only an http(s) URL is kept; anything else (javascript:, data:, junk) becomes empty. */
function httpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : "";
  } catch {
    return "";
  }
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


async function getClientIp() {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

async function forwardToWebhook(formPage: LeadFormPage, input: Parameters<typeof buildLeadWebhookPayload>[0]) {
  // C&I leads go to a different downstream workflow than residential/EV, so
  // each gets its own webhook URL rather than sharing one. A "test_webhook"
  // cookie (set from the browser console for QA) redirects C&I submissions
  // to TESTING_WEBHOOK_URL instead, without touching the real CRM webhook.
  // On production the cookie must carry TEST_WEBHOOK_TOKEN, so a visitor
  // can't divert their lead away from the CRM just by setting the cookie.
  const testCookie = (await cookies()).get("test_webhook")?.value;
  const testToken = process.env.TEST_WEBHOOK_TOKEN;
  const testMode =
    formPage === "ci" &&
    (process.env.VERCEL_ENV === "production" ? Boolean(testToken) && testCookie === testToken : testCookie === "1");
  const envVar = testMode ? "TESTING_WEBHOOK_URL" : formPage === "ci" ? "CI_LEAD_WEBHOOK_URL" : "LEAD_WEBHOOK_URL";
  const webhookUrl = process.env[envVar];
  if (!webhookUrl) return;
  if (!webhookUrl.startsWith("https://")) {
    console.error(`${envVar} is not an https:// URL; refusing to send.`);
    return;
  }

  const payload = formPage === "ci" ? buildCiLeadWebhookPayload(input) : buildLeadWebhookPayload(input);
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

// The first two arguments are bound in the client components, which means the
// browser posts them and can change them. formPage is checked against the
// known funnels; the client's source label is ignored in favour of SOURCE_PAGE.
export async function submitLead(_sourcePage: string, formPage: LeadFormPage, _prevState: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const localeRaw = clean(formData.get("locale"), 5);
  const locale = hasLocale(localeRaw) ? localeRaw : DEFAULT_LOCALE;
  const t = getDictionary(locale).leadMessages;
  if (!isLeadFunnel(formPage)) {
    return { status: "error", message: t.invalid };
  }
  const sourcePage = SOURCE_PAGE[formPage];
  const clientIp = await getClientIp();

  // Namespaced so the tracking endpoints (their own "track:" buckets) can
  // never use up a visitor's lead submissions.
  const rateLimit = checkRateLimit(`lead:${clientIp}`);
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
  const roleOptions = pageOptions.roleInOrganization?.length ? pageOptions.roleInOrganization : ROLE_IN_ORGANIZATION_OPTIONS;

  const salutation = oneOf(clean(formData.get("salutation"), 10), salutationOptions);
  const full_name = noFormula(clean(formData.get("full_name")));
  const company_name = noFormula(clean(formData.get("company_name"), 150));
  // Checked against Malaysia's real number lengths, in WhatsApp's digit
  // format ("60123456789"). The browser caps this too, but only here is it
  // enforced: a direct POST, or typing before the page hydrates, skips it.
  const phone = toLeadPhone(clean(formData.get("phone"), 30));
  const email = clean(formData.get("email"));
  const state = oneOf(clean(formData.get("state"), 50), stateOptions);
  const monthly_bill_range = oneOf(clean(formData.get("monthly_bill_range"), 50), billRangeOptions);
  const property_type = oneOf(clean(formData.get("property_type"), 80), propertyTypeOptions);
  const role_in_organization = oneOf(clean(formData.get("role_in_organization"), 60), roleOptions);
  const electric_supply = oneOf(clean(formData.get("electric_supply"), 30), electricSupplyOptions);
  const preferred_language = oneOf(clean(formData.get("preferred_language"), 30), languageOptions);
  // Attribution values are kept as sent (so campaign reporting is unchanged),
  // only with control characters stripped and formula starts escaped.
  const campaign_id = noFormula(clean(formData.get("campaign_id"), 100));
  const gclid = noFormula(clean(formData.get("gclid"), 100));
  const fbclid = noFormula(clean(formData.get("fbclid"), 200));
  const landing_referrer = httpUrl(clean(formData.get("landing_referrer"), 500));
  const utm_source = noFormula(clean(formData.get("utm_source"), 100));
  const utm_medium = noFormula(clean(formData.get("utm_medium"), 100));
  const utm_campaign = noFormula(clean(formData.get("utm_campaign"), 100));
  const utm_term = noFormula(clean(formData.get("utm_term"), 150));
  const utm_content = noFormula(clean(formData.get("utm_content"), 150));
  const landing_page_source = httpUrl(clean(formData.get("landing_page_source"), 300));
  const charge_time = noFormula(clean(formData.get("charge_time"), 80));
  const turnstileToken = clean(formData.get("cf-turnstile-response"), 2000);

  // Every field on the form is mandatory — mirrors the `required` attributes
  // client-side, but the server is the one that actually enforces it.
  if (
    !salutation ||
    !full_name ||
    !phone ||
    !EMAIL_PATTERN.test(email) ||
    !state ||
    !monthly_bill_range
  ) {
    return { status: "error", message: t.invalid };
  }
  if (formPage === "ci" && (!company_name || !role_in_organization)) {
    return { status: "error", message: t.invalid };
  }
  if (formPage !== "ci" && (!property_type || !electric_supply || !preferred_language)) {
    return { status: "error", message: t.invalid };
  }

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

  const requestHost = ((await headers()).get("host") ?? "").split(":")[0];
  const turnstileOk = await verifyTurnstileToken(turnstileToken, clientIp, requestHost);
  if (!turnstileOk) {
    return { status: "error", message: t.captcha };
  }

  // C&I leads are commercial enquiries, not residential/EV ones — different
  // shape (a company, an industry, no property type or electric supply) and a
  // different sales workflow, so they get their own table rather than being
  // squeezed into atap_leads's residential/EV columns.
  let supabaseOk = true;
  try {
    // Server-only key: the lead tables no longer need to accept inserts from
    // the public anon key, so every lead has to come through this action's
    // validation, rate limit and bot check.
    const supabase = getSupabaseServiceClient();
    const { industry: _industry, ...ciExtraFields } = extraFields;
    const { error } =
      formPage === "ci"
        ? await supabase.from("ci_leads").insert({
            full_name, company_name, industry: extraFields["industry"] || null,
            role_in_organization: role_in_organization || null,
            phone, email, state, monthly_bill_range,
            lead_source: classifyLeadSource(landing_referrer), campaign_id: campaign_id || null,
            extra_fields: ciExtraFields,
          })
        : await supabase.from("atap_leads").insert({
            // atap_leads holds both Residential and EV, and this form is the
            // only place that knows which. Rows written before the column
            // existed stay 'unknown' — no signal survived to recover them.
            segment: formPage === "ev" ? "ev" : "residential",
            full_name, phone, email, state,
            monthly_bill_range, property_type, electric_supply, preferred_language,
            lead_source: classifyLeadSource(landing_referrer), campaign_id: campaign_id || null,
            extra_fields: extraFields,
          });
    if (error) {
      // Code and message only: `details` can echo the row, i.e. the visitor's PII.
      console.error("Supabase insert error", error.code, error.message);
      supabaseOk = false;
    }
  } catch (err) {
    console.error(err);
    supabaseOk = false;
  }

  await forwardToWebhook(formPage, {
    salutation,
    fullName: full_name,
    companyName: company_name,
    phone,
    email,
    state,
    monthlyBillRange: monthly_bill_range,
    propertyType: property_type,
    electricSupply: electric_supply,
    industry: extraFields["industry"] ?? "",
    roleInOrganization: role_in_organization,
    preferredLanguage: preferred_language,
    sourceOfLeads: landing_referrer,
    campaignId: campaign_id,
    gclid,
    fbclid,
    utmSource: utm_source,
    utmMedium: utm_medium,
    utmCampaign: utm_campaign,
    utmTerm: utm_term,
    utmContent: utm_content,
    sourcePage,
    remarks: [charge_time ? `Usually charges EV: ${charge_time}` : "", ...extraFieldsSummary].filter(Boolean).join(" | "),
    landingPageSource: landing_page_source,
  });

  if (!supabaseOk) {
    return { status: "error", message: t.generic };
  }

  // Proof, for the thank-you page's proxy check, that this browser was just
  // handed a real success — not a bookmark, a shared link, or a bot. Scoped
  // to the exact route this submission is about to redirect to.
  (await cookies()).set("lead_ok", await signLeadToken(formPage), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: `/${locale}${THANK_YOU_FUNNELS[formPage].thankYouPath}`,
    maxAge: 600,
  });

  return { status: "success", message: t.success };
}
