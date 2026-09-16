"use client";

import Script from "next/script";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { submitLead, type LeadFormState } from "@/app/[lang]/(main)/actions/submitLead";
import Header from "@/app/[lang]/(main)/components/Header";
import Footer from "@/app/[lang]/(main)/components/Footer";
import SectionHeading from "@/app/[lang]/(main)/components/SectionHeading";
import ScrollReveal from "@/app/[lang]/(main)/components/ScrollReveal";
import type { LeadFormOptionLists } from "@/app/[lang]/(main)/components/LeadForm";
import { getExternalReferrer } from "@/lib/getExternalReferrer";
import { EV_CALC_DEFAULTS } from "@/lib/content";
import type { PublishedCustomField } from "@/lib/publishedContent";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
} from "@/lib/leadFormOptions";
import { fill, type Dictionary, type Locale } from "@/lib/i18n";

const initialFormState: LeadFormState = { status: "idle" };
const submitEvLead = submitLead.bind(null, "MAQO EV Landing Page");
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type ChargeTime = "day" | "night" | "mixed";

type EvCopy = Dictionary["ev"];

function optionLabel(map: Record<string, string>, value: string) {
  return map[value] ?? value;
}

/* Line icons for the "what's covered" pillars — stroke uses currentColor, so
   each one just inherits whatever text colour its icon-box wrapper sets. */
const iconProps = {
  viewBox: "0 0 32 32",
  width: 26,
  height: 26,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function IconPanel() {
  return (
    <svg {...iconProps}>
      <path d="M6 6h20l3 14H3L6 6Z" />
      <path d="M4.4 13h23.2M13 6l-1.5 14M19 6l1.5 14M16 20v6M11 26h10" />
    </svg>
  );
}
function IconInverter() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="4" width="22" height="24" rx="3" />
      <path d="M17 9l-5 8h4l-1 6 5-8h-4l1-6Z" />
      <path d="M9 24h4" />
    </svg>
  );
}
function IconBattery() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="9" width="23" height="14" rx="3" />
      <path d="M29 14v4" />
      <path d="M7 13v6M12 13v6M17 13v6" />
    </svg>
  );
}
function IconApp() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="3" width="14" height="26" rx="3" />
      <path d="M13 21l3-5 3 3 4-7" />
      <path d="M14 25.5h4" />
    </svg>
  );
}
function IconSupport() {
  return (
    <svg {...iconProps}>
      <path d="M5 19v-4a11 11 0 0 1 22 0v4" />
      <rect x="3" y="17" width="6" height="8" rx="2.5" />
      <rect x="23" y="17" width="6" height="8" rx="2.5" />
      <path d="M26 25v1a3 3 0 0 1-3 3h-4" />
    </svg>
  );
}

const PILLAR_ICONS = [IconPanel, IconInverter, IconBattery, IconApp, IconSupport];

export default function EvPage({
  locale,
  dict,
  t,
  space,
  options,
  optionValues,
  customFields,
  evCalcConfig,
}: {
  locale: Locale;
  dict: Dictionary;
  t: EvCopy;
  space: string;
  options: Dictionary["formOptions"];
  optionValues?: LeadFormOptionLists;
  customFields?: PublishedCustomField[];
  evCalcConfig?: typeof EV_CALC_DEFAULTS;
}) {
  const [bill, setBill] = useState(650);
  const [chargeTime, setChargeTime] = useState<ChargeTime>("night");
  const [formState, formAction, submitting] = useActionState(submitEvLead, initialFormState);
  const campaignIdRef = useRef<HTMLInputElement>(null);
  const referrerRef = useRef<HTMLInputElement>(null);
  const landingPageSourceRef = useRef<HTMLInputElement>(null);

  const evCalc = evCalcConfig ?? EV_CALC_DEFAULTS;
  const salutations = optionValues?.salutations?.length ? optionValues.salutations : SALUTATIONS;
  const states = optionValues?.states?.length ? optionValues.states : MALAYSIAN_STATES;
  const billRanges = optionValues?.billRanges?.length ? optionValues.billRanges : BILL_RANGES;
  const propertyTypes = optionValues?.propertyTypes?.length ? optionValues.propertyTypes : PROPERTY_TYPES;
  const electricSupply = optionValues?.electricSupply?.length ? optionValues.electricSupply : ELECTRIC_SUPPLY_OPTIONS;
  const languages = optionValues?.languages?.length ? optionValues.languages : COMMUNICATION_LANGUAGES;

  // `label` is what the sales team reads in the lead's remarks, so it stays English
  // whatever language the visitor chose. On-page wording comes from the dictionary.
  const CHARGE_OPTIONS: { key: ChargeTime; label: string; offsetRate: number }[] = [
    { key: "day", label: "Mostly during the day", offsetRate: evCalc.offsetDayPercent / 100 },
    { key: "night", label: "Mostly at night", offsetRate: evCalc.offsetNightPercent / 100 },
    { key: "mixed", label: "Mixed / it varies", offsetRate: evCalc.offsetMixedPercent / 100 },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get("campaign_id") || params.get("utm_campaign") || params.get("gclid") || "";
    if (campaignIdRef.current) campaignIdRef.current.value = campaignId;
    if (referrerRef.current) referrerRef.current.value = getExternalReferrer();
    // Hardcoded, not derived from location.pathname: this page is reachable both
    // at /ev directly and at /?site=ev (rewritten by proxy.ts), but it's always
    // the EV landing page — never derive this from the visible URL/query string.
    if (landingPageSourceRef.current) landingPageSourceRef.current.value = window.location.origin + "/ev";
  }, []);

  const selected = CHARGE_OPTIONS.find((c) => c.key === chargeTime)!;
  const selectedCopy = t.calculator.options[chargeTime];

  const results = useMemo(() => {
    const totalKwh = bill / evCalc.ratePerKwh;
    const systemKwp = Math.max(evCalc.minSystemKwp, (totalKwh / evCalc.avgKwhPerKwpMonth) * evCalc.referenceSystemKwp);
    const panels = Math.round(systemKwp / evCalc.kwpPerPanel);
    const monthlySavings = bill * selected.offsetRate;
    const newBill = Math.max(evCalc.minMonthlyBill, bill - monthlySavings);
    return {
      systemKwp: systemKwp.toFixed(1),
      panels,
      monthlySavings: Math.round(monthlySavings),
      newBill: Math.round(newBill),
      tenYear: Math.round(monthlySavings * 120),
      thirtyYear: Math.round(monthlySavings * 360),
    };
  }, [bill, selected, evCalc]);

  const buttonPrimary =
    "inline-flex items-center justify-center rounded-full bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95";
  const buttonGhost =
    "inline-flex items-center justify-center rounded-full border border-base-line px-6 py-3 text-sm font-semibold text-base-ink transition hover:border-base-slate";
  const fieldClass =
    "rounded-lg border border-base-line bg-base-panel px-3 py-2 text-sm text-base-ink outline-none ring-brand-green placeholder:text-base-slate focus:border-brand-green focus:ring-2";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-base-ink";

  return (
    <>
      <Header locale={locale} t={dict} />

      <main className="flex-1">
        {/* ---------- 1. Hero + enquiry form ---------- */}
        <section className="relative overflow-hidden bg-base-bg">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div>
              <span className="section-eyebrow inline-flex items-center rounded-full bg-brand-green-tint px-3 py-1 text-xs font-semibold uppercase text-brand-green-ink">
                {t.hero.badge}
              </span>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-base-ink sm:text-5xl">
                {t.hero.titleLine1Lead}
                {space}
                <span className="text-brand-orange-ink">{t.hero.titleLine1Accent}</span>
                {t.hero.titleLine1Tail}
                <br />
                {t.hero.titleLine2Lead}
                {space}
                <span className="text-base-slate line-through decoration-2">{t.hero.titleLine2Strike}</span>
                {t.hero.titleLine2Tail}
              </h1>
              <p className="mt-4 max-w-xl text-base text-base-slate sm:text-lg">
                {t.hero.ledeLead}
                {space}
                <span className="animate-credential-highlight font-bold text-brand-green-ink">{t.hero.ledeBold}</span>
                {t.hero.ledeTail}
              </p>

              <ul className="mt-7 grid gap-3">
                {t.form.points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-base-ink">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green-tint text-[11px] font-bold text-brand-green-ink">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#assessment" className={buttonPrimary}>
                  {t.hero.primaryCta}
                </a>
                <a href="#calculator" className={buttonGhost}>
                  {t.hero.secondaryCta}
                </a>
              </div>

              <p className="mt-8 border-t border-base-line pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-base-slate">
                {t.hero.trust.join(" · ")}
              </p>
            </div>

            <div className="lg:pl-4">
              <div id="assessment" className="rounded-2xl border border-base-line bg-base-panel p-6 shadow-lg shadow-base-line/50 sm:p-8">
                <h2 className="text-lg font-semibold text-base-ink">{t.form.title}</h2>
                <p className="mt-1 text-sm text-base-slate">{t.form.body}</p>

                {formState.status === "success" ? (
                  <div className="mt-6 rounded-2xl border border-brand-green bg-brand-green-tint p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green text-white">✓</div>
                    <h3 className="text-base font-semibold text-base-ink">{t.form.successTitle}</h3>
                    <p className="mt-2 text-sm text-base-slate">{formState.message}</p>
                  </div>
                ) : (
                  <form action={formAction} className="mt-6 grid grid-cols-1 gap-4">
                    {formState.status === "error" && formState.message && (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formState.message}</p>
                    )}
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="campaign_id" ref={campaignIdRef} />
                    <input type="hidden" name="landing_referrer" ref={referrerRef} />
                    <input type="hidden" name="landing_page_source" ref={landingPageSourceRef} />
                    <input type="hidden" name="charge_time" value={selected.label} readOnly />
                    {/* Honeypot — hidden from real visitors, bots tend to fill every field. */}
                    <div className="absolute left-[-9999px]" aria-hidden="true">
                      <label>
                        {t.form.honeypot}
                        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>

                    <label className={labelClass}>
                      {t.form.salutation}
                      <select id="salutation" name="salutation" defaultValue="" disabled={submitting} className={fieldClass}>
                        <option value="">—</option>
                        {salutations.map((s) => (
                          <option key={s} value={s}>
                            {optionLabel(options.salutations, s)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      {t.form.fullName}
                      <input id="full_name" name="full_name" required disabled={submitting} className={fieldClass} />
                    </label>
                    <label className={labelClass}>
                      {t.form.mobile}
                      <input id="phone" name="phone" required disabled={submitting} placeholder="012-345 6789" className={fieldClass} />
                    </label>
                    <label className={labelClass}>
                      {t.form.email}
                      <input id="email" name="email" type="email" disabled={submitting} className={fieldClass} />
                    </label>
                    <label className={labelClass}>
                      {t.form.state}
                      <select id="state" name="state" required defaultValue="" disabled={submitting} className={fieldClass}>
                        <option value="" disabled>
                          {t.form.statePlaceholder}
                        </option>
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {optionLabel(options.states, s)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      {t.form.bill}
                      <select id="monthly_bill_range" name="monthly_bill_range" required defaultValue="" disabled={submitting} className={fieldClass}>
                        <option value="" disabled>
                          {t.form.billPlaceholder}
                        </option>
                        {billRanges.map((s) => (
                          <option key={s} value={s}>
                            {optionLabel(options.billRanges, s)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      {t.form.propertyType}
                      <select id="property_type" name="property_type" required defaultValue="" disabled={submitting} className={fieldClass}>
                        <option value="" disabled>
                          {t.form.propertyTypePlaceholder}
                        </option>
                        {propertyTypes.map((s) => (
                          <option key={s} value={s}>
                            {optionLabel(options.propertyTypes, s)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      {t.form.supply}
                      <select id="electric_supply" name="electric_supply" defaultValue="" disabled={submitting} className={fieldClass}>
                        <option value="">{t.form.supplyPlaceholder}</option>
                        {electricSupply.map((s) => (
                          <option key={s} value={s}>
                            {optionLabel(options.supply, s)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={labelClass}>
                      {t.form.language}
                      <select id="preferred_language" name="preferred_language" defaultValue="English" disabled={submitting} className={fieldClass}>
                        {languages.map((s) => (
                          <option key={s} value={s}>
                            {optionLabel(options.languages, s)}
                          </option>
                        ))}
                      </select>
                    </label>

                    {!!customFields?.length &&
                      customFields.map((f) => (
                        <label key={f.key} className={labelClass}>
                          {f.label}
                          <select id={f.key} name={f.key} defaultValue="" disabled={submitting} className={fieldClass}>
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
                      disabled={submitting}
                      className="mt-1 inline-flex items-center justify-center rounded-lg bg-brand-orange-deep px-6 py-3 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? t.form.submitting : t.form.submit}
                    </button>
                    <p className="text-xs text-base-slate">{t.form.legal}</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 2. Credential band ---------- */}
        <section className="border-y border-base-line bg-base-panel py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <dl className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
              {t.band.map((item) => (
                <div key={item.label}>
                  <dt className="sr-only">{item.label}</dt>
                  <dd>
                    <span className="block text-3xl font-bold text-brand-green-ink sm:text-4xl">{item.value}</span>
                    <span className="mt-2 block text-sm text-base-slate">{item.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- 3. The problem: before / after ---------- */}
        <section id="the-problem" className="py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <ScrollReveal>
              <SectionHeading eyebrow={t.problem.eyebrow} title={t.problem.title} body={t.problem.body} />
              <a href="#calculator" className="mt-4 inline-block text-sm font-semibold text-brand-green-ink hover:underline">
                {t.problem.link}
              </a>
            </ScrollReveal>
            <ScrollReveal delayMs={100} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-base-line bg-base-panel p-6">
                <span className="inline-flex rounded-full bg-base-line px-2.5 py-1 text-xs font-semibold text-base-slate">{t.problem.beforeTag}</span>
                <div className="mt-4 text-3xl font-bold text-base-ink">RM 612</div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-base-line">
                  <div className="h-full w-full rounded-full bg-base-slate" />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-base-slate">{t.problem.beforeNote}</p>
              </div>
              <div className="rounded-2xl border border-brand-green bg-brand-green-tint p-6">
                <span className="inline-flex rounded-full bg-brand-green px-2.5 py-1 text-xs font-semibold text-white">{t.problem.afterTag}</span>
                <div className="mt-4 text-3xl font-bold text-brand-green-ink">RM 78</div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
                  <div className="h-full rounded-full bg-brand-green" style={{ width: "13%" }} />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-base-ink">{t.problem.afterNote}</p>
              </div>
              <p className="col-span-full text-xs leading-relaxed text-base-slate">{t.problem.compareNote}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* ---------- 4. Calculator ---------- */}
        <section id="calculator" className="scroll-mt-20 bg-base-bg py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow={t.calculator.eyebrow} title={t.calculator.title} body={t.calculator.body} />

            <div className="mt-10 rounded-3xl bg-brand-orange p-[1.5px] shadow-lg shadow-brand-orange/25">
              <div className="overflow-hidden rounded-[calc(1.5rem-1.5px)] border border-base-line bg-base-panel">
                <div className="grid grid-cols-1 gap-6 border-b border-base-line bg-base-bg p-6 sm:grid-cols-2 sm:p-8">
                  <label className="flex flex-col gap-2 text-sm font-medium text-base-ink">
                    {t.calculator.billLabel}
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={150}
                        max={1800}
                        step={10}
                        value={bill}
                        onChange={(e) => setBill(Number(e.target.value))}
                        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-base-line accent-brand-green-deep"
                      />
                      <span className="w-20 shrink-0 rounded-lg border border-base-line bg-base-panel px-2.5 py-1.5 text-center text-sm font-semibold text-base-ink">
                        RM {bill}
                      </span>
                    </div>
                  </label>
                  <div className="flex flex-col gap-2 text-sm font-medium text-base-ink">
                    {t.calculator.chargeLabel}
                    <div className="grid grid-cols-3 gap-2">
                      {CHARGE_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setChargeTime(opt.key)}
                          className={`rounded-lg border px-3 py-2.5 text-center text-xs font-semibold transition ${
                            chargeTime === opt.key
                              ? "border-brand-green bg-brand-green-tint text-brand-green-ink"
                              : "border-base-line bg-base-panel text-base-slate hover:border-base-slate"
                          }`}
                        >
                          {t.calculator.options[opt.key].label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="section-eyebrow text-xs font-semibold uppercase text-brand-green-ink">
                    {fill(t.calculator.resultTitle, { bill, phrase: selectedCopy.phrase })}
                  </p>
                  <p className="mt-1 text-sm text-base-slate">{selectedCopy.note}</p>

                  <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-4">
                      <div className="rounded-2xl border border-base-line bg-base-bg p-4 text-center sm:p-5">
                        <p className="text-[11px] font-semibold uppercase text-base-slate">{t.calculator.systemSize}</p>
                        <p className="mt-1.5 text-lg font-bold text-base-ink sm:text-2xl">{results.systemKwp} kWp</p>
                      </div>
                      <div className="rounded-2xl border border-base-line bg-base-bg p-4 text-center sm:p-5">
                        <p className="text-[11px] font-semibold uppercase text-base-slate">{t.calculator.panels}</p>
                        <p className="mt-1.5 text-lg font-bold text-base-ink sm:text-2xl">{results.panels}</p>
                      </div>
                      <div className="rounded-2xl border border-base-line bg-base-bg p-4 text-center sm:p-5">
                        <p className="text-[11px] font-semibold uppercase text-base-slate">{t.calculator.newBill}</p>
                        <p className="mt-1.5 text-lg font-bold text-base-ink sm:text-2xl">RM {results.newBill.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-wow-magenta bg-wow-magenta-tint p-6 text-center sm:p-7">
                      <p className="text-xs font-semibold uppercase tracking-wide text-base-slate">{t.calculator.monthlySavings}</p>
                      <p className="mt-2 text-5xl font-extrabold leading-none text-wow-magenta-ink">RM {results.monthlySavings.toLocaleString()}</p>
                      <div className="mt-6 grid grid-cols-2 gap-3 border-t border-wow-magenta/25 pt-5">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">{t.calculator.tenYear}</p>
                          <p className="mt-1 text-xl font-bold text-base-ink">RM {results.tenYear.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-base-slate">{t.calculator.thirtyYear}</p>
                          <p className="mt-1 text-xl font-bold text-base-ink">RM {results.thirtyYear.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#assessment"
                    className="mt-8 flex items-center justify-center gap-2 rounded-full bg-brand-orange-deep px-8 py-5 text-base font-bold text-white transition-all duration-150 ease-out shadow-[0_6px_0_0_var(--color-brand-orange-ink)] hover:-translate-y-0.5 hover:shadow-[0_8px_0_0_var(--color-brand-orange-ink)] active:translate-y-1 active:shadow-[0_1px_0_0_var(--color-brand-orange-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-base-ink"
                  >
                    {t.calculator.cta}
                  </a>
                  <p className="mt-4 text-xs leading-relaxed text-base-slate">{t.calculator.disclaimer}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 5. How it works ---------- */}
        <section id="how-it-works" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow={t.how.eyebrow} title={t.how.title} />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {t.how.steps.map((step, i) => (
                <ScrollReveal key={step.title} delayMs={i * 60}>
                  <div className="h-full rounded-2xl border border-base-line bg-base-panel p-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-sm font-bold text-white">{i + 1}</div>
                    <h3 className="mt-4 text-sm font-semibold text-base-ink">{step.title}</h3>
                    <p className="mt-2 text-sm text-base-slate">{step.body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 6. What's covered ---------- */}
        <section id="covered" className="scroll-mt-20 bg-base-panel py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading eyebrow={t.covered.eyebrow} title={t.covered.title} body={t.covered.body} />
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {t.covered.pillars.map((p, i) => {
                const Icon = PILLAR_ICONS[i];
                return (
                  <ScrollReveal key={p.title} delayMs={i * 70}>
                    <div className="h-full rounded-2xl border border-base-line bg-base-bg p-7 shadow-md">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green-tint text-brand-green-deep">
                        <Icon />
                      </span>
                      <h3 className="mt-5 text-lg font-bold text-base-ink">{p.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-base-slate">{p.body}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
              <ScrollReveal delayMs={t.covered.pillars.length * 70} className="h-full">
                <div className="flex h-full flex-col justify-center rounded-2xl bg-brand-green-deep p-7 text-white">
                  <h3 className="text-lg font-bold">{t.covered.ctaTitle}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/90">{t.covered.ctaBody}</p>
                  <a href="#assessment" className="mt-4 inline-block text-sm font-semibold text-white hover:underline">
                    {t.covered.ctaLink}
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ---------- 7. FAQ ---------- */}
        <section id="faq" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} body={t.faq.body} />
            <a href="#assessment" className="mt-4 inline-block text-sm font-semibold text-brand-green-ink hover:underline">
              {t.faq.link}
            </a>
            <div className="mt-8 divide-y divide-base-line rounded-2xl border border-base-line bg-base-panel">
              {t.faq.items.map((item, i) => (
                <details key={item.q} name="ev-faq" open={i === 0} className="group">
                  <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-base-ink sm:px-6 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span aria-hidden className="shrink-0 text-lg text-base-slate">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">−</span>
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm leading-relaxed text-base-slate sm:px-6">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 8. Closing CTA ---------- */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl bg-brand-orange-tint px-6 py-14 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-base-ink sm:text-3xl">
              {t.finalCta.titleLead}
              {space}
              <span className="text-brand-orange-ink">{t.finalCta.titleAccent}</span>
              {t.finalCta.titleTail}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-base-slate sm:text-base">{t.finalCta.body}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a href="#assessment" className={buttonPrimary}>
                {t.hero.primaryCta}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} t={dict.footer} />
    </>
  );
}
