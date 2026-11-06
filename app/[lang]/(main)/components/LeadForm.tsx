"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { submitLead, type LeadFormState } from "../actions/submitLead";
import { resolveLeadAttribution } from "@/lib/attribution";
import type { PublishedCustomField } from "@/lib/publishedContent";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
} from "@/lib/leadFormOptions";
import TermsAgree from "./TermsAgree";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { PhoneTextField, SelectField, TextField, type Option } from "./formFields";
import { SALESPEOPLE } from "@/lib/salespeople";
import { newRefId, whatsappLeadText, whatsappLink, WHATSAPP_HANDOFF_KEY } from "@/lib/whatsappLead";

const initialState: LeadFormState = { status: "idle" };

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const submitMainSiteLead = submitLead.bind(null, "MAQO Main Site", "main");

const EMPTY_FIELDS = { salutation: "", name: "", phone: "", email: "", state: "", bill: "", propertyType: "", supply: "", language: "", referredBy: "" };
const noSubscribe = () => () => {};

/** Dropdown option lists — CMS-managed in Supabase (lead_form_options), falling
 * back to these hardcoded lists so the form never breaks if a table is empty. */
export type LeadFormOptionLists = {
  salutations?: string[];
  states?: string[];
  billRanges?: string[];
  propertyTypes?: string[];
  electricSupply?: string[];
  languages?: string[];
  roleInOrganization?: string[];
};

/**
 * Which option values exist is decided by the CMS; only the visitor-facing text
 * is translated. A value marketing adds in the CMS that has no dictionary entry
 * yet falls through to showing the value itself, so a new option appears in all
 * three languages immediately rather than rendering blank.
 *
 * The value posted is always the raw CMS string, never the translated label —
 * the server validates against the same allowlist in every language.
 */
function options(values: string[], map: Record<string, string>): Option[] {
  return values.map((value) => ({ value, label: map[value] ?? value }));
}

export default function LeadForm({
  locale,
  t,
  labels,
  options: lists,
  customFields,
}: {
  locale: Locale;
  t: Dictionary["leadForm"];
  labels: Dictionary["formOptions"];
  options?: LeadFormOptionLists;
  customFields?: PublishedCustomField[];
}) {
  const salutations = lists?.salutations?.length ? lists.salutations : SALUTATIONS;
  const states = lists?.states?.length ? lists.states : MALAYSIAN_STATES;
  const billRanges = lists?.billRanges?.length ? lists.billRanges : BILL_RANGES;
  const propertyTypes = lists?.propertyTypes?.length ? lists.propertyTypes : PROPERTY_TYPES;
  const electricSupply = lists?.electricSupply?.length ? lists.electricSupply : ELECTRIC_SUPPLY_OPTIONS;
  const languages = lists?.languages?.length ? lists.languages : COMMUNICATION_LANGUAGES;
  const [state, formAction, pending] = useActionState(submitMainSiteLead, initialState);
  const router = useRouter();
  const campaignIdRef = useRef<HTMLInputElement>(null);
  const gclidRef = useRef<HTMLInputElement>(null);
  const fbclidRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const landingPageSourceRef = useRef<HTMLInputElement>(null);
  const utmSourceRef = useRef<HTMLInputElement>(null);
  const utmMediumRef = useRef<HTMLInputElement>(null);
  const utmCampaignRef = useRef<HTMLInputElement>(null);
  const utmTermRef = useRef<HTMLInputElement>(null);
  const utmContentRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const refIdRef = useRef<HTMLInputElement>(null);
  const [referred, setReferred] = useState(false);
  const [preview, setPreview] = useState(() => whatsappLeadText(EMPTY_FIELDS, ""));
  // Frontierx Maqo (T00) is the test account: only offered on *.vercel.app preview links.
  const onPreviewSite = useSyncExternalStore(noSubscribe, () => window.location.hostname.endsWith(".vercel.app"), () => false);
  const salespeople = SALESPEOPLE.filter((p) => p.code !== "T00" || onPreviewSite);

  /** The WhatsApp message from what's in the form now. The preview leaves out the hidden ref id. */
  function messageText(refId = "") {
    const form = formRef.current;
    if (!form) return "";
    const data = new FormData(form);
    const v = (name: string) => String(data.get(name) ?? "");
    return whatsappLeadText(
      {
        salutation: v("salutation"),
        name: v("full_name"),
        phone: v("phone"),
        email: v("email"),
        state: v("state"),
        bill: v("monthly_bill_range"),
        propertyType: v("property_type"),
        supply: v("electric_supply"),
        language: v("preferred_language"),
        referredBy: v("referred") === "yes" ? v("referred_by") : "",
      },
      refId,
    );
  }

  useEffect(() => {
    // Reads the visit's first-touch attribution (persisted by lib/attribution
    // since whichever page the visitor actually landed on) rather than this
    // page's own URL, so campaign data survives even when the visitor
    // browsed elsewhere before reaching this form.
    const a = resolveLeadAttribution();
    if (campaignIdRef.current) campaignIdRef.current.value = a.campaignId;
    if (gclidRef.current) gclidRef.current.value = a.gclid;
    if (fbclidRef.current) fbclidRef.current.value = a.fbclid;
    if (referrerRef.current) referrerRef.current.value = a.referrer;
    if (utmSourceRef.current) utmSourceRef.current.value = a.utmSource;
    if (utmMediumRef.current) utmMediumRef.current.value = a.utmMedium;
    if (utmCampaignRef.current) utmCampaignRef.current.value = a.utmCampaign;
    if (utmTermRef.current) utmTermRef.current.value = a.utmTerm;
    if (utmContentRef.current) utmContentRef.current.value = a.utmContent;
    // Hardcoded, not derived from location.pathname: this component is only ever
    // the main site's landing page, regardless of query strings on the URL.
    if (landingPageSourceRef.current) landingPageSourceRef.current.value = window.location.origin;
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      router.push(localePath(locale, "/thank-you"));
    }
  }, [state.status, router, locale]);

  if (state.status === "success") {
    return null;
  }

  return (
    <div id="assessment" className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-lg shadow-base-line/50 sm:p-8">
      <h2 className="text-lg font-semibold text-base-ink">{t.title}</h2>
      <p className="mt-1 text-sm text-base-slate">
        {t.subtitle}
      </p>

      {state.status === "error" && state.message && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <form
        ref={formRef}
        action={formAction}
        // After the change has landed (React re-renders the salesman field on Yes/No).
        onChange={() => setTimeout(() => setPreview(messageText()))}
        // A new ref id for each attempt (React reads the form after this runs); the thank-you page
        // opens WhatsApp with the message, once the lead is saved. submitLead checks the id.
        onSubmit={() => {
          const refId = newRefId();
          if (refIdRef.current) refIdRef.current.value = refId;
          try {
            sessionStorage.setItem(WHATSAPP_HANDOFF_KEY, whatsappLink(messageText(refId)));
          } catch {
            // storage blocked: the thank-you page then shows only the plain WhatsApp button
          }
        }}
        className="mt-6 grid grid-cols-1 gap-4"
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="ref_id" ref={refIdRef} />
        <input type="hidden" name="campaign_id" ref={campaignIdRef} />
        <input type="hidden" name="gclid" ref={gclidRef} />
        <input type="hidden" name="fbclid" ref={fbclidRef} />
        <input type="hidden" name="landing_referrer" ref={referrerRef} />
        <input type="hidden" name="landing_page_source" ref={landingPageSourceRef} />
        <input type="hidden" name="utm_source" ref={utmSourceRef} />
        <input type="hidden" name="utm_medium" ref={utmMediumRef} />
        <input type="hidden" name="utm_campaign" ref={utmCampaignRef} />
        <input type="hidden" name="utm_term" ref={utmTermRef} />
        <input type="hidden" name="utm_content" ref={utmContentRef} />
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label>
            {t.honeypot}
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <SelectField
          label={t.salutation}
          name="salutation"
          placeholder={t.salutationPlaceholder}
          options={options(salutations, labels.salutations)}
        />
        <TextField
          label={t.fullName}
          name="full_name"
          required
          placeholder={t.fullNamePlaceholder}
          autoComplete="name"
        />
        <PhoneTextField label={t.mobile} locale={locale} />
        <TextField
          label={t.email}
          name="email"
          required
          placeholder="you@email.com"
          type="email"
          inputMode="email"
          autoComplete="email"
        />
        <SelectField
          label={t.state}
          name="state"
          placeholder={t.statePlaceholder}
          options={options(states, labels.states)}
        />
        <SelectField
          label={t.bill}
          name="monthly_bill_range"
          placeholder={t.billPlaceholder}
          options={options(billRanges, labels.billRanges)}
        />
        <SelectField
          label={t.propertyType}
          name="property_type"
          placeholder={t.propertyTypePlaceholder}
          options={options(propertyTypes, labels.propertyTypes)}
        />
        <SelectField
          label={t.supply}
          name="electric_supply"
          placeholder={t.supplyPlaceholder}
          options={options(electricSupply, labels.supply)}
        />
        <SelectField
          label={t.language}
          name="preferred_language"
          placeholder={t.languagePlaceholder}
          options={options(languages, labels.languages)}
        />

        {/* CMS-defined extras. Values are authored in one language, so no
            label map — the value doubles as its own label. */}
        {customFields?.map((f) => (
          <SelectField
            key={f.key}
            label={f.label}
            name={f.key}
            placeholder="-"
            options={f.values.map((value) => ({ value, label: value }))}
          />
        ))}

        <fieldset className="flex flex-col gap-1.5">
          <legend className="text-[13px] font-semibold uppercase tracking-wide text-base-slate">{t.referredQuestion}</legend>
          <div className="mt-1.5 flex gap-6 text-base text-base-ink">
            <label className="inline-flex min-h-12 cursor-pointer items-center gap-2">
              <input type="radio" name="referred" value="no" checked={!referred} onChange={() => setReferred(false)} className="h-5 w-5 accent-brand-green" />
              {t.referredNo}
            </label>
            <label className="inline-flex min-h-12 cursor-pointer items-center gap-2">
              <input type="radio" name="referred" value="yes" checked={referred} onChange={() => setReferred(true)} className="h-5 w-5 accent-brand-green" />
              {t.referredYes}
            </label>
          </div>
        </fieldset>
        {referred && (
          <SelectField
            label={t.salesman}
            name="referred_by"
            placeholder={t.salesmanPlaceholder}
            options={salespeople.map((p) => ({ value: p.name, label: p.name }))}
          />
        )}

        {TURNSTILE_SITE_KEY && (
          <>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
            <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
          </>
        )}

        <TermsAgree locale={locale} className="text-sm leading-relaxed text-base-slate" linkClassName="font-semibold underline hover:text-base-ink" />

        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex min-h-14 items-center justify-center rounded-xl bg-brand-orange-deep px-6 text-base font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? t.submitting : t.submit}
        </button>
        <p className="text-center text-sm text-base-slate">{t.whatsappNote}</p>
        <div className="border-t border-dashed border-base-line pt-4 text-sm text-base-slate">
          <p className="font-semibold text-base-ink">{t.previewTitle}</p>
          <pre aria-live="polite" className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-base-line bg-base-bg p-4 font-mono text-[13px] leading-relaxed text-base-ink">
            {preview}
          </pre>
        </div>
      </form>
    </div>
  );
}
