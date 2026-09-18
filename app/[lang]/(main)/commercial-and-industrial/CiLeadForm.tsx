"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { submitLead, type LeadFormState } from "../actions/submitLead";
import { getExternalReferrer } from "@/lib/getExternalReferrer";
import type { LeadFormOptionLists } from "../components/LeadForm";
import type { PublishedCustomField } from "@/lib/publishedContent";
import { SALUTATIONS, MALAYSIAN_STATES } from "@/lib/leadFormOptions";
import { localePath, type Locale } from "@/lib/i18n";

const initialState: LeadFormState = { status: "idle" };
const submitCiLead = submitLead.bind(null, "MAQO C&I Landing Page", "ci");
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** C&I bands, not the residential RM200–RM900 ladder used on the main site —
 *  fallback only, the CMS's own published values (page "ci") take priority. */
const CI_BILL_RANGES = [
  "Below RM5,000",
  "RM5,000 – RM10,000",
  "RM10,000 – RM30,000",
  "RM30,000 – RM50,000",
  "RM50,000 – RM100,000",
  "Above RM100,000",
];

const INDUSTRIES = [
  "Manufacturing",
  "Logistics & Warehousing",
  "Retail & Commercial Buildings",
  "Agriculture",
  "Healthcare",
  "Education",
  "Others",
];

const fieldClass =
  "rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green placeholder:text-base-slate focus:border-brand-green focus:ring-2";
const labelClass = "flex flex-col gap-1 text-sm font-medium text-base-ink";

function RequiredMark() {
  return (
    <span className="text-brand-orange-ink" aria-hidden="true">
      {" *"}
    </span>
  );
}

export default function CiLeadForm({
  locale,
  options,
  customFields,
}: {
  locale: Locale;
  options?: LeadFormOptionLists;
  customFields?: PublishedCustomField[];
}) {
  const salutations = options?.salutations?.length ? options.salutations : SALUTATIONS;
  const states = options?.states?.length ? options.states : MALAYSIAN_STATES;
  const billRanges = options?.billRanges?.length ? options.billRanges : CI_BILL_RANGES;
  // "Industry" is a CMS custom field like any other, but always rendered in
  // this fixed spot rather than appended at the end — it's core to what a C&I
  // enquiry needs, not an incidental extra.
  const industryField = customFields?.find((f) => f.key === "industry");
  const industries = industryField?.values.length ? industryField.values : INDUSTRIES;
  const otherCustomFields = customFields?.filter((f) => f.key !== "industry") ?? [];

  const [state, formAction, pending] = useActionState(submitCiLead, initialState);
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
    if (landingPageSourceRef.current) landingPageSourceRef.current.value = window.location.origin;
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      router.push(localePath(locale, "/commercial-and-industrial/thank-you"));
    }
  }, [state.status, router, locale]);

  if (state.status === "success") {
    return null;
  }

  return (
    <div
      id="assessment"
      className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-lg shadow-base-line/50 sm:p-8"
    >
      <h2 className="text-lg font-semibold text-base-ink">Request your free C&amp;I solar assessment</h2>
      <p className="mt-1 text-sm text-base-slate">
        Tell us about your site and we will come back with an indicative system size, savings and payback.
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
            Leave this field empty
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className={labelClass} htmlFor="ci-salutation">
          Salutation
          <select id="ci-salutation" name="salutation" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select
            </option>
            {salutations.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass} htmlFor="ci-full-name">
          <span>
            Full name
            <RequiredMark />
          </span>
          <input
            id="ci-full-name"
            name="full_name"
            required
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
        </label>

        <label className={labelClass} htmlFor="ci-company">
          <span>
            Company name
            <RequiredMark />
          </span>
          <input
            id="ci-company"
            name="company_name"
            required
            autoComplete="organization"
            placeholder="Registered company name"
            className={fieldClass}
          />
        </label>

        <label className={labelClass} htmlFor="ci-industry">
          <span>
            Industry / sector
            <RequiredMark />
          </span>
          <select id="ci-industry" name="industry" required defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select your industry
            </option>
            {industries.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass} htmlFor="ci-phone">
          <span>
            Mobile number
            <RequiredMark />
          </span>
          <input
            id="ci-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="012-345 6789"
            className={fieldClass}
          />
        </label>

        <label className={labelClass} htmlFor="ci-email">
          Work email
          <input id="ci-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" className={fieldClass} />
        </label>

        <label className={labelClass} htmlFor="ci-state">
          Site location
          <select id="ci-state" name="state" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select a state
            </option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass} htmlFor="ci-bill">
          Average monthly TNB bill
          <select id="ci-bill" name="monthly_bill_range" defaultValue="" className={fieldClass}>
            <option value="" disabled>
              Select a range
            </option>
            {billRanges.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        {otherCustomFields.map((f) => (
          <label key={f.key} className={labelClass}>
            {f.label}
            <select name={f.key} defaultValue="" className={fieldClass}>
              <option value="">—</option>
              {f.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
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
          className="mt-1 inline-flex items-center justify-center rounded-lg bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Submitting…" : "Get Free Solar Assessment & ROI Quote"}
        </button>

        <p className="text-xs text-base-slate">
          By submitting, you agree to be contacted by MAQO Solar about your enquiry.
        </p>
      </form>
    </div>
  );
}
