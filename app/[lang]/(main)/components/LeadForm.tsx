"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { submitLead, type LeadFormState } from "../actions/submitLead";
import AttributionFields from "./AttributionFields";
import type { PublishedCustomField } from "@/lib/publishedContent";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
  withFallback,
  type LeadFormOptionLists,
} from "@/lib/leadFormOptions";
import { PRIVACY_POLICY } from "@/lib/privacyPolicy";
import { localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { PhoneTextField, SelectField, TextField, type Option } from "./formFields";

const initialState: LeadFormState = { status: "idle" };

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const submitMainSiteLead = submitLead.bind(null, "MAQO Main Site", "main");

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
  const salutations = withFallback(lists?.salutations, SALUTATIONS);
  const states = withFallback(lists?.states, MALAYSIAN_STATES);
  const billRanges = withFallback(lists?.billRanges, BILL_RANGES);
  const propertyTypes = withFallback(lists?.propertyTypes, PROPERTY_TYPES);
  const electricSupply = withFallback(lists?.electricSupply, ELECTRIC_SUPPLY_OPTIONS);
  const languages = withFallback(lists?.languages, COMMUNICATION_LANGUAGES);
  const [state, formAction, pending] = useActionState(submitMainSiteLead, initialState);
  const router = useRouter();

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
        <AttributionFields />
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
          {t.consent} <a href={localePath(locale, "/privacy")} target="_blank" className="font-semibold underline hover:text-base-ink">{PRIVACY_POLICY[locale].formLink}</a>
        </p>
      </form>
    </div>
  );
}
