"use client";

import { useState } from "react";
import { SALUTATIONS, MALAYSIAN_STATES } from "@/lib/leadFormOptions";
import { CheckCircle } from "./icons";

/**
 * C&I enquiry form.
 *
 * NOT CONNECTED TO ANYTHING. Submitting keeps the values in local state and
 * renders the confirmation panel; nothing reaches Supabase, the lead webhook or
 * the CMS. This is deliberate for now — do not point paid traffic at this page
 * until it is wired to the `submitLead` server action the way
 * app/[lang]/(main)/components/LeadForm.tsx is, which also means allowlisting
 * `company_name` and `industry` inside actions/submitLead.ts so they survive
 * validation.
 *
 * The amber notice below the submit button exists so a visitor is never told
 * their enquiry was received when it was not. Delete that one block the moment
 * the form is wired.
 */

/** C&I bands, not the residential RM200–RM900 ladder used on the main site. */
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

type FormValues = {
  salutation: string;
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  industry: string;
  state: string;
  monthlyBill: string;
};

const EMPTY: FormValues = {
  salutation: "",
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  industry: "",
  state: "",
  monthlyBill: "",
};

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

export default function CiLeadForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  if (submitted) {
    return (
      <div
        id="assessment"
        className="rounded-2xl border border-brand-green bg-brand-green-tint p-8 text-center shadow-sm"
        role="status"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-base-ink">Thank you, {values.fullName || "there"}.</h2>
        <p className="mt-2 text-sm text-base-slate">
          Our commercial team will be in touch to arrange your site assessment and ROI projection.
        </p>
        {/* Remove together with the notice in the form once submissions are wired. */}
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          Preview only — this form is not connected yet, so nothing was sent or saved.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY);
            setSubmitted(false);
          }}
          className="mt-4 text-sm font-semibold text-brand-green-ink underline underline-offset-4"
        >
          Submit another enquiry
        </button>
      </div>
    );
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mt-6 grid grid-cols-1 gap-4"
      >
        <label className={labelClass} htmlFor="ci-salutation">
          Salutation
          <select
            id="ci-salutation"
            name="salutation"
            value={values.salutation}
            onChange={(e) => update("salutation", e.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              Select
            </option>
            {SALUTATIONS.map((s) => (
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
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
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
            value={values.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className={labelClass} htmlFor="ci-industry">
          <span>
            Industry / sector
            <RequiredMark />
          </span>
          <select
            id="ci-industry"
            name="industry"
            required
            value={values.industry}
            onChange={(e) => update("industry", e.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              Select your industry
            </option>
            {INDUSTRIES.map((s) => (
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
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className={labelClass} htmlFor="ci-email">
          Work email
          <input
            id="ci-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={fieldClass}
          />
        </label>

        <label className={labelClass} htmlFor="ci-state">
          Site location
          <select
            id="ci-state"
            name="state"
            value={values.state}
            onChange={(e) => update("state", e.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              Select a state
            </option>
            {MALAYSIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass} htmlFor="ci-bill">
          Average monthly TNB bill
          <select
            id="ci-bill"
            name="monthly_bill_range"
            value={values.monthlyBill}
            onChange={(e) => update("monthlyBill", e.target.value)}
            className={fieldClass}
          >
            <option value="" disabled>
              Select a range
            </option>
            {CI_BILL_RANGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="mt-1 inline-flex items-center justify-center rounded-lg bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95"
        >
          Get Free Solar Assessment &amp; ROI Quote
        </button>

        {/* Delete this block the moment the form is wired to submitLead. */}
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          Preview build — this form is not connected to the CRM yet. Submissions are not saved or sent.
        </p>

        <p className="text-xs text-base-slate">
          By submitting, you agree to be contacted by MAQO Solar about your enquiry.
        </p>
      </form>
    </div>
  );
}
