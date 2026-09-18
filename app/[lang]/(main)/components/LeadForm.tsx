"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { submitLead, type LeadFormState } from "../actions/submitLead";
import { getExternalReferrer } from "@/lib/getExternalReferrer";
import type { PublishedCustomField } from "@/lib/publishedContent";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
} from "@/lib/leadFormOptions";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { PillField, SelectField, TextField, type Option } from "./formFields";

const initialState: LeadFormState = { status: "idle" };

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const submitMainSiteLead = submitLead.bind(null, "MAQO Main Site", "main");

/** Dropdown option lists — CMS-managed in Supabase (lead_form_options), falling
 * back to these hardcoded lists so the form never breaks if a table is empty. */
export type LeadFormOptionLists = {
  salutations?: string[];
  states?: string[];
  billRanges?: string[];
  propertyTypes?: string[];
  electricSupply?: string[];
  languages?: string[];
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get("campaign_id") || params.get("utm_campaign") || params.get("gclid") || "";
    if (campaignIdRef.current) campaignIdRef.current.value = campaignId;
    if (gclidRef.current) gclidRef.current.value = params.get("gclid") || "";
    if (fbclidRef.current) fbclidRef.current.value = params.get("fbclid") || "";
    if (referrerRef.current) referrerRef.current.value = getExternalReferrer();
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

      <form action={formAction} className="mt-6 grid grid-cols-1 gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="campaign_id" ref={campaignIdRef} />
        <input type="hidden" name="gclid" ref={gclidRef} />
        <input type="hidden" name="fbclid" ref={fbclidRef} />
        <input type="hidden" name="landing_referrer" ref={referrerRef} />
        <input type="hidden" name="landing_page_source" ref={landingPageSourceRef} />
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label>
            {t.honeypot}
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {/* Salutation and state stay dropdowns: eight titles and eleven states
            laid out as pills would dwarf the fields that actually qualify a
            lead. The four short lists below are pills instead — every option
            visible, no picker wheel to scroll on a phone. */}
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
        <TextField
          label={t.mobile}
          name="phone"
          required
          placeholder="012-345 6789"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
        />
        <TextField
          label={t.email}
          name="email"
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
        <PillField
          label={t.bill}
          name="monthly_bill_range"
          options={options(billRanges, labels.billRanges)}
        />
        <PillField
          label={t.propertyType}
          name="property_type"
          options={options(propertyTypes, labels.propertyTypes)}
        />
        <PillField
          label={t.supply}
          name="electric_supply"
          options={options(electricSupply, labels.supply)}
        />
        <PillField
          label={t.language}
          name="preferred_language"
          options={options(languages, labels.languages)}
        />

        {/* CMS-defined extras. Kept as dropdowns because marketing can add a
            list of any length here, and an unbounded pill grid would take over
            the form. Values are authored in one language, so no label map. */}
        {customFields?.map((f) => (
          <SelectField
            key={f.key}
            label={f.label}
            name={f.key}
            placeholder="—"
            clearable
            options={f.values.map((value) => ({ value, label: value }))}
          />
        ))}

        {TURNSTILE_SITE_KEY && (
          <>
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
            <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
          </>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex min-h-14 items-center justify-center rounded-xl bg-brand-orange-deep px-6 text-base font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? t.submitting : t.submit}
        </button>

        <p className="text-xs leading-relaxed text-base-slate">
          {t.consent}
        </p>
      </form>
    </div>
  );
}
