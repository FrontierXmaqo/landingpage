"use client";

import { useActionState, useEffect, useRef } from "react";
import Script from "next/script";
import { submitLead, type LeadFormState } from "@/app/(main)/actions/submitLead";
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get("campaign_id") || params.get("utm_campaign") || params.get("gclid") || "";
    if (campaignIdRef.current) campaignIdRef.current.value = campaignId;
    if (referrerRef.current) referrerRef.current.value = document.referrer || window.location.href;
  }, []);

  if (state.status === "success") {
    return (
      <div
        id="assessment"
        className="rounded-2xl border border-maqo-green/20 bg-maqo-green/5 p-8 text-center shadow-sm"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-maqo-green text-white">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Request received</h2>
        <p className="mt-2 text-sm text-slate-600">{state.message}</p>
      </div>
    );
  }

  return (
    <div id="assessment" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Get your free home assessment</h2>
      <p className="mt-1 text-sm text-slate-500">
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
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label>
            Leave this field blank
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Salutation
          <select
            name="salutation"
            defaultValue=""
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 focus:border-maqo-green focus:ring-2"
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
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Full name *
          <input
            name="full_name"
            required
            placeholder="Ahmad bin Ismail"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 placeholder:text-slate-400 focus:border-maqo-green focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Mobile / WhatsApp number *
          <input
            name="phone"
            required
            placeholder="012-345 6789"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 placeholder:text-slate-400 focus:border-maqo-green focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            placeholder="you@email.com"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 placeholder:text-slate-400 focus:border-maqo-green focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          State
          <select
            name="state"
            defaultValue=""
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 focus:border-maqo-green focus:ring-2"
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
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Average monthly TNB bill
          <select
            name="monthly_bill_range"
            defaultValue=""
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 focus:border-maqo-green focus:ring-2"
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
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Property type
          <select
            name="property_type"
            defaultValue=""
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 focus:border-maqo-green focus:ring-2"
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
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Electric supply
          <select
            name="electric_supply"
            defaultValue=""
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 focus:border-maqo-green focus:ring-2"
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
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Preferred communication language
          <select
            name="preferred_language"
            defaultValue=""
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-maqo-green/30 focus:border-maqo-green focus:ring-2"
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
          className="mt-1 inline-flex items-center justify-center rounded-lg bg-maqo-orange px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? "Submitting…" : "Get My Free Home Assessment"}
        </button>

        <p className="text-xs text-slate-500">
          By submitting, you agree to be contacted by MAQO Engineering Sdn Bhd about your solar
          assessment. No Spam.
        </p>
      </form>
    </div>
  );
}
