"use client";

import { useActionState, useEffect, useRef } from "react";
import Script from "next/script";
import { submitLead, type LeadFormState } from "@/app/(main)/actions/submitLead";
import { getExternalReferrer } from "@/lib/getExternalReferrer";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
} from "@/lib/leadFormOptions";

const initialState: LeadFormState = { status: "idle" };

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const submitMainSiteLead = submitLead.bind(null, "MAQO Main Site");

export default function LeadForm({ defaultPackage }: { defaultPackage?: string }) {
  const [state, formAction, pending] = useActionState(submitMainSiteLead, initialState);
  const campaignIdRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const landingPageSourceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get("campaign_id") || params.get("utm_campaign") || params.get("gclid") || "";
    if (campaignIdRef.current) campaignIdRef.current.value = campaignId;
    if (referrerRef.current) referrerRef.current.value = getExternalReferrer();
    // Hardcoded, not derived from location.pathname: this component is only ever
    // the main site's landing page, regardless of query strings on the URL.
    if (landingPageSourceRef.current) landingPageSourceRef.current.value = window.location.origin;
  }, []);

  if (state.status === "success") {
    return (
      <div
        id="assessment"
        className="rounded-2xl border border-brand-green bg-brand-green-tint p-8 text-center shadow-sm"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-base-ink">Request received</h2>
        <p className="mt-2 text-sm text-base-slate">{state.message}</p>
      </div>
    );
  }

  return (
    <div id="assessment" className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-lg shadow-base-line/50 sm:p-8">
      <h2 className="text-lg font-semibold text-base-ink">Get your free home assessment</h2>
      <p className="mt-1 text-sm text-base-slate">
        Takes 60 seconds. Our ATAP team calls you within 1 business day.
      </p>

      {state.status === "error" && state.message && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <form action={formAction} className="mt-6 grid grid-cols-1 gap-4">
        <input type="hidden" name="campaign_id" ref={campaignIdRef} />
        <input type="hidden" name="landing_referrer" ref={referrerRef} />
        <input type="hidden" name="landing_page_source" ref={landingPageSourceRef} />
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label>
            Leave this field blank
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Salutation
          <select
            name="salutation"
            defaultValue=""
            className="rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green focus:border-brand-green focus:ring-2"
          >
            <option value="" disabled>
              Select salutation
            </option>
            {SALUTATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Full name *
          <input
            name="full_name"
            required
            placeholder="Ahmad bin Ismail"
            className="rounded-lg border border-base-line px-3 py-2 text-sm text-base-ink outline-none ring-brand-green placeholder:text-base-slate focus:border-brand-green focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Mobile number *
          <input
            name="phone"
            required
            placeholder="012-345 6789"
            className="rounded-lg border border-base-line px-3 py-2 text-sm text-base-ink outline-none ring-brand-green placeholder:text-base-slate focus:border-brand-green focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@email.com"
            className="rounded-lg border border-base-line px-3 py-2 text-sm text-base-ink outline-none ring-brand-green placeholder:text-base-slate focus:border-brand-green focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          State
          <select
            name="state"
            defaultValue=""
            className="rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green focus:border-brand-green focus:ring-2"
          >
            <option value="" disabled>
              Select state
            </option>
            {MALAYSIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Average monthly TNB bill
          <select
            name="monthly_bill_range"
            defaultValue=""
            className="rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green focus:border-brand-green focus:ring-2"
          >
            <option value="" disabled>
              Select range
            </option>
            {BILL_RANGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Property type
          <select
            name="property_type"
            defaultValue=""
            className="rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green focus:border-brand-green focus:ring-2"
          >
            <option value="" disabled>
              Select type
            </option>
            {PROPERTY_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Electric supply
          <select
            name="electric_supply"
            defaultValue=""
            className="rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green focus:border-brand-green focus:ring-2"
          >
            <option value="" disabled>
              Select supply
            </option>
            {ELECTRIC_SUPPLY_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-base-ink">
          Preferred communication language
          <select
            name="preferred_language"
            defaultValue=""
            className="rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green focus:border-brand-green focus:ring-2"
          >
            <option value="" disabled>
              Select language
            </option>
            {COMMUNICATION_LANGUAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

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
          {pending ? "Submitting…" : "Get My Free Home Assessment"}
        </button>

        <p className="text-xs text-base-slate">
          By submitting, you agree to be contacted by MAQO Engineering Sdn Bhd about your solar
          assessment. No Spam.
        </p>
      </form>
    </div>
  );
}
