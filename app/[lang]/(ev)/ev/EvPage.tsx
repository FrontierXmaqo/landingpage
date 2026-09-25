"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { submitLead, type LeadFormState } from "@/app/[lang]/(main)/actions/submitLead";
import LanguageSwitcher from "@/app/[lang]/(main)/components/LanguageSwitcher";
import Footer from "@/app/[lang]/(main)/components/Footer";
import PhoneField from "@/app/[lang]/(main)/components/PhoneField";
import type { LeadFormOptionLists } from "@/app/[lang]/(main)/components/LeadForm";
import { resolveLeadAttribution } from "@/lib/attribution";
import { EV_CALC_DEFAULTS, OLD_SITE_IMAGES } from "@/lib/content";
import type { PublishedCustomField } from "@/lib/publishedContent";
import {
  SALUTATIONS,
  MALAYSIAN_STATES,
  BILL_RANGES,
  PROPERTY_TYPES,
  ELECTRIC_SUPPLY_OPTIONS,
  COMMUNICATION_LANGUAGES,
} from "@/lib/leadFormOptions";
import { fill, localePath, type Dictionary, type Locale } from "@/lib/i18n";
import { PRIVACY_POLICY } from "@/lib/privacyPolicy";

const initialFormState: LeadFormState = { status: "idle" };
const submitEvLead = submitLead.bind(null, "MAQO EV Landing Page", "ev");
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type ChargeTime = "day" | "night" | "mixed";

type EvCopy = Dictionary["ev"];

function optionLabel(map: Record<string, string>, value: string) {
  return map[value] ?? value;
}

function ArrowIcon() {
  return (
    <svg
      className="arrow"
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

/* Line icons for the "what's covered" pillars. */
const iconProps = {
  viewBox: "0 0 32 32",
  width: 30,
  height: 30,
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

const PILLAR_ICONS = [
  <IconPanel key="panel" />,
  <IconInverter key="inverter" />,
  <IconBattery key="battery" />,
  <IconApp key="app" />,
  <IconSupport key="support" />,
];

/* Hero illustration: rooftop solar array feeding a home EV charger. */
function SolarEvScene({ label, charging }: { label: string; charging: string }) {
  return (
    <svg
      className="solar-ev"
      viewBox="0 0 560 400"
      width="100%"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF4DC" />
          <stop offset="100%" stopColor="#FDFEFB" />
        </linearGradient>
        <linearGradient id="panelFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#254A34" />
          <stop offset="100%" stopColor="#0E2116" />
        </linearGradient>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DCE6D8" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="560" height="400" fill="url(#sky)" />

      {/* Sun */}
      <g className="sun">
        <circle cx="468" cy="72" r="32" fill="#F5901E" opacity="0.16" />
        <circle cx="468" cy="72" r="21" fill="#F5901E" />
        <g stroke="#F5901E" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          <line x1="468" y1="32" x2="468" y2="42" />
          <line x1="468" y1="102" x2="468" y2="112" />
          <line x1="428" y1="72" x2="438" y2="72" />
          <line x1="498" y1="72" x2="508" y2="72" />
          <line x1="440" y1="44" x2="447" y2="51" />
          <line x1="489" y1="93" x2="496" y2="100" />
          <line x1="440" y1="100" x2="447" y2="93" />
          <line x1="489" y1="51" x2="496" y2="44" />
        </g>
      </g>

      {/* Ground + driveway */}
      <rect x="0" y="330" width="560" height="70" fill="#E4EDDC" />
      <rect x="0" y="330" width="560" height="2.5" fill="#CFDCC4" />
      <path d="M300,330 L560,330 L560,400 L262,400 Z" fill="#DAE4D1" />

      {/* House */}
      <path d="M78,215 L302,150 L302,330 L78,330 Z" fill="#FFFFFF" />
      <path d="M78,215 L302,150 L302,330 L78,330 Z" fill="none" stroke="#CFDCC4" strokeWidth="2" />
      <path d="M62,205 L306,134 L318,155 L74,226 Z" fill="#152A1D" />

      {/* Solar array */}
      <g stroke="#7DB928" strokeWidth="1.2" strokeOpacity="0.6">
        <path d="M72,192 L107,182 L114,207 L79,217 Z" fill="url(#panelFace)" />
        <path d="M110,181 L145,171 L152,196 L117,206 Z" fill="url(#panelFace)" />
        <path d="M148,170 L183,160 L190,185 L155,195 Z" fill="url(#panelFace)" />
        <path d="M186,159 L221,149 L228,174 L193,184 Z" fill="url(#panelFace)" />
        <path d="M224,148 L259,138 L266,163 L231,173 Z" fill="url(#panelFace)" />
        <path d="M262,137 L297,127 L304,152 L269,162 Z" fill="url(#panelFace)" />
      </g>
      <path d="M72,192 L297,127 L300,138 L75,203 Z" fill="#F5901E" opacity="0.22" />

      {/* Windows + door */}
      <rect x="104" y="248" width="46" height="38" rx="4" fill="#EDF5E3" stroke="#CFDCC4" strokeWidth="2" />
      <line x1="127" y1="248" x2="127" y2="286" stroke="#CFDCC4" strokeWidth="2" />
      <rect x="172" y="248" width="46" height="38" rx="4" fill="#EDF5E3" stroke="#CFDCC4" strokeWidth="2" />
      <line x1="195" y1="248" x2="195" y2="286" stroke="#CFDCC4" strokeWidth="2" />
      <rect x="242" y="252" width="42" height="78" rx="4" fill="#EDF5E3" stroke="#CFDCC4" strokeWidth="2" />
      <circle cx="276" cy="292" r="3" fill="#7DB928" />

      {/* Wall charger */}
      <rect x="306" y="232" width="28" height="46" rx="8" fill="#7DB928" />
      <path d="M322,244 L313,258 L319,258 L316,268 L325,254 L319,254 Z" fill="#FFFFFF" />
      <circle className="charger-led" cx="320" cy="273" r="2.6" fill="#F2FFDD" />

      {/* Charging cable */}
      <path className="cable" d="M334,262 C356,282 344,314 372,306" />
      <circle r="4.5" fill="#7DB928">
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M334,262 C356,282 344,314 372,306" />
      </circle>
      <circle r="4.5" fill="#F5901E">
        <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M334,262 C356,282 344,314 372,306" />
      </circle>

      {/* Car */}
      <g>
        <path
          d="M368,332 L368,308 Q369,298 382,294 L406,286 Q426,262 456,262 L480,262 Q502,264 514,286 L530,294 Q540,298 540,310 L540,332 Z"
          fill="url(#carBody)"
          stroke="#BCCDB2"
          strokeWidth="2"
        />
        <path d="M410,288 Q428,270 456,270 L478,270 Q498,272 508,288 Z" fill="#152A1D" />
        <line x1="456" y1="270" x2="456" y2="288" stroke="#BCCDB2" strokeWidth="2" />
        <circle cx="375" cy="304" r="6" fill="#7DB928" />
        <circle cx="375" cy="304" r="2.2" fill="#FFFFFF" />
        <rect x="533" y="300" width="8" height="7" rx="3" fill="#F5901E" />
        <circle cx="404" cy="332" r="19" fill="#152A1D" />
        <circle cx="404" cy="332" r="8" fill="#CBD9C2" />
        <circle cx="506" cy="332" r="19" fill="#152A1D" />
        <circle cx="506" cy="332" r="8" fill="#CBD9C2" />
      </g>

      {/* Charging badge */}
      <g>
        <rect x="404" y="208" width="116" height="36" rx="18" fill="#FFFFFF" stroke="#DDE7D5" strokeWidth="1.5" />
        <rect x="419" y="220" width="22" height="12" rx="3" fill="none" stroke="#7DB928" strokeWidth="2" />
        <rect x="442" y="223" width="3" height="6" rx="1.5" fill="#7DB928" />
        <rect x="421" y="222" width="18" height="8" rx="1.5" fill="#7DB928">
          <animate attributeName="width" values="4;18;18" dur="2.4s" repeatCount="indefinite" />
        </rect>
        <text x="453" y="231" className="ev-badge-text">
          {charging}
        </text>
      </g>
    </svg>
  );
}

/* Sun → panels → charger flow diagram (shown in "How it works"). */
function ElectronFlow({ t }: { t: EvCopy["how"] }) {
  return (
    <div className="flow-card">
      <h4>{t.flowTitle}</h4>
      <svg viewBox="0 0 320 220" width="100%" height="220" aria-hidden="true">
        <path
          className="flow-path"
          d="M40,40 C120,40 100,110 160,110 C220,110 200,180 280,180"
        />
        <circle className="flow-node" cx="40" cy="40" r="20" />
        <text className="flow-label" x="40" y="20" textAnchor="middle">
          {t.flowSun}
        </text>
        <circle className="flow-node" cx="160" cy="110" r="20" />
        <text className="flow-label" x="160" y="90" textAnchor="middle">
          {t.flowPanels}
        </text>
        <circle className="flow-node" cx="280" cy="180" r="20" />
        <text className="flow-label" x="280" y="205" textAnchor="middle">
          {t.flowCharger}
        </text>
        <circle
          className="flow-dot"
          r="5"
          style={
            {
              offsetPath:
                "path('M40,40 C120,40 100,110 160,110 C220,110 200,180 280,180')",
            } as React.CSSProperties
          }
        />
      </svg>
      <p className="flow-note">
        {t.flowNote}
      </p>
    </div>
  );
}

export default function EvPage({
  locale,
  dict,
  t,
  space,
  options,
  optionValues,
  customFields,
  evCalcConfig,
  faqItems,
}: {
  locale: Locale;
  dict: Dictionary;
  t: EvCopy;
  space: string;
  options: Dictionary["formOptions"];
  optionValues?: LeadFormOptionLists;
  customFields?: PublishedCustomField[];
  evCalcConfig?: typeof EV_CALC_DEFAULTS;
  faqItems?: { q: string; a: string }[];
}) {
  const [bill, setBill] = useState(650);
  const [chargeTime, setChargeTime] = useState<ChargeTime>("night");
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [formState, formAction, submitting] = useActionState(submitEvLead, initialFormState);
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

  const evCalc = evCalcConfig ?? EV_CALC_DEFAULTS;
  const faqList = faqItems?.length ? faqItems : t.faq.items;
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
    // Hardcoded, not derived from location.pathname: this page is reachable both
    // at /ev directly and at /?site=ev (rewritten by proxy.ts), but it's always
    // the EV landing page — never derive this from the visible URL/query string.
    if (landingPageSourceRef.current) landingPageSourceRef.current.value = window.location.origin + "/ev";
  }, []);

  useEffect(() => {
    if (formState.status === "success") {
      router.push(localePath(locale, "/ev/thank-you"));
    }
  }, [formState.status, router, locale]);

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



  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link href={localePath(locale, "/")} className="topbar-logo" aria-label={dict.header.logoAlt}>
            <Image src={OLD_SITE_IMAGES.logo} alt={dict.header.logoAlt} fill className="topbar-logo-img" sizes="160px" priority />
          </Link>
          <div className="topbar-right">
            <LanguageSwitcher
              locale={locale}
              label={dict.languageSwitcher.label}
              classes={{ root: "lang-switch", links: "lang-pills", link: "lang-pill", select: "lang-select" }}
            />
            <a className="btn btn-primary btn-sm" href="#assessment">
              {dict.header.cta}
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <span className="hero-blob hero-blob-a" aria-hidden="true" />
          <span className="hero-blob hero-blob-b" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                {t.hero.badge}
              </div>
              <h1>
                {t.hero.titleLine1Lead}
                {space}
                <span className="hl">{t.hero.titleLine1Accent}</span>
                {t.hero.titleLine1Tail}
                <br />
                {t.hero.titleLine2Lead}
                {space}
                <span className="strike">{t.hero.titleLine2Strike}</span>
                {t.hero.titleLine2Tail}
              </h1>
              <p className="lede">
                {t.hero.ledeLead}
                {space}
                <b>{t.hero.ledeBold}</b>
                {t.hero.ledeTail}
              </p>
              <div className="hero-ctas">
                <a className="btn btn-primary btn-lg" href="#assessment">
                  {t.hero.primaryCta}
                  <ArrowIcon />
                </a>
                <a className="btn btn-outline btn-lg" href="#calculator">
                  {t.hero.secondaryCta}
                </a>
              </div>
              <ul className="hero-trust">
                {t.hero.trust.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-frame">
                <SolarEvScene label={t.hero.sceneLabel} charging={t.hero.charging} />
              </div>
              <div className="hero-chip">
                <span className="hero-chip-label">{t.hero.chipLabel}</span>
                <span className="hero-chip-value">
                  RM 612 <ArrowIcon /> <b>RM 78</b>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CREDENTIAL BAND */}
        <section className="band">
          <div className="wrap band-grid">
            {t.band.map((item) => (
              <div className="band-item" key={item.value}>
                <b>{item.value}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* PROBLEM */}
        <section id="the-problem">
          <div className="wrap split">
            <div className="split-copy">
              <span className="eyebrow">
                <i />
                {t.problem.eyebrow}
              </span>
              <h2>{t.problem.title}</h2>
              <p>{t.problem.body}</p>
              <a className="link-arrow" href="#calculator">
                {t.problem.link}
                <ArrowIcon />
              </a>
            </div>
            <div className="compare">
              <div className="bill-card before">
                <span className="bill-tag before">{t.problem.beforeTag}</span>
                <div className="bill-amount">RM 612</div>
                <div className="bill-bar-track">
                  <span className="bill-bar-fill" />
                </div>
                <p className="bill-note">{t.problem.beforeNote}</p>
              </div>
              <div className="bill-card after">
                <span className="bill-tag after">{t.problem.afterTag}</span>
                <div className="bill-amount">RM 78</div>
                <div className="bill-bar-track">
                  <span className="bill-bar-fill" />
                </div>
                <p className="bill-note">{t.problem.afterNote}</p>
              </div>
              <p className="compare-note">{t.problem.compareNote}</p>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator" className="alt-bg">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                {t.calculator.eyebrow}
              </span>
              <h2>{t.calculator.title}</h2>
              <p>{t.calculator.body}</p>
            </div>
            <div className="calc-panel">
              <div>
                <div className="field">
                  <label htmlFor="billRange">{t.calculator.billLabel}</label>
                  <input
                    type="range"
                    id="billRange"
                    min={150}
                    max={1800}
                    step={10}
                    value={bill}
                    onChange={(e) => setBill(Number(e.target.value))}
                  />
                  <div className="range-val">RM {bill}</div>
                </div>
                <div className="field">
                  <label>{t.calculator.chargeLabel}</label>
                  <div className="toggle-row">
                    {CHARGE_OPTIONS.map((opt) => (
                      <div
                        key={opt.key}
                        className={
                          "toggle-opt" + (chargeTime === opt.key ? " active" : "")
                        }
                        role="button"
                        tabIndex={0}
                        onClick={() => setChargeTime(opt.key)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && setChargeTime(opt.key)
                        }
                      >
                        {t.calculator.options[opt.key].label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="calc-results">
                <h4>{fill(t.calculator.resultTitle, { bill, phrase: selectedCopy.phrase })}</h4>
                <p className="calc-note">{selectedCopy.note}</p>
                <div className="res-grid">
                  <div className="res-item">
                    <b>{results.systemKwp} kWp</b>
                    <span>{t.calculator.systemSize}</span>
                  </div>
                  <div className="res-item">
                    <b>{results.panels}</b>
                    <span>{t.calculator.panels}</span>
                  </div>
                  <div className="res-item highlight">
                    <b>RM {results.monthlySavings.toLocaleString()}</b>
                    <span>{t.calculator.monthlySavings}</span>
                  </div>
                  <div className="res-item">
                    <b>RM {results.newBill.toLocaleString()}</b>
                    <span>{t.calculator.newBill}</span>
                  </div>
                </div>
                <div className="res-long">
                  <div>
                    <b>RM {results.tenYear.toLocaleString()}</b>
                    <span>{t.calculator.tenYear}</span>
                  </div>
                  <div>
                    <b>RM {results.thirtyYear.toLocaleString()}</b>
                    <span>{t.calculator.thirtyYear}</span>
                  </div>
                </div>
                <a className="btn btn-primary" href="#assessment">
                  {t.calculator.cta}
                  <ArrowIcon />
                </a>
                <p className="calc-disclaimer">{t.calculator.disclaimer}</p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                {t.how.eyebrow}
              </span>
              <h2>{t.how.title}</h2>
            </div>
            <div className="how-grid">
              <ol className="steps">
                {t.how.steps.map((step, i) => (
                  <li className="step" key={step.title}>
                    <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <ElectronFlow t={t.how} />
            </div>
          </div>
        </section>

        {/* WHAT'S COVERED */}
        <section id="covered" className="alt-bg">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                {t.covered.eyebrow}
              </span>
              <h2>{t.covered.title}</h2>
              <p>{t.covered.body}</p>
            </div>
            <div className="pillars">
              {t.covered.pillars.map((p, i) => (
                <article className="pillar" key={p.title}>
                  <span className="pillar-icon">{PILLAR_ICONS[i]}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </article>
              ))}
              <article className="pillar pillar-cta">
                <h3>{t.covered.ctaTitle}</h3>
                <p>{t.covered.ctaBody}</p>
                <a className="link-arrow" href="#assessment">
                  {t.covered.ctaLink}
                  <ArrowIcon />
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="alt-bg">
          <div className="wrap faq-grid">
            <div className="section-head">
              <span className="eyebrow">
                <i />
                {t.faq.eyebrow}
              </span>
              <h2>{t.faq.title}</h2>
              <p>{t.faq.body}</p>
              <a className="link-arrow" href="#assessment">
                {t.faq.link}
                <ArrowIcon />
              </a>
            </div>
            <div className="faq-list">
              {faqList.map((item, i) => (
                <div
                  key={item.q}
                  className={"faq-item" + (openFaq === i ? " open" : "")}
                >
                  <button
                    className="faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    aria-expanded={openFaq === i}
                  >
                    {item.q}
                    <span className="plus">+</span>
                  </button>
                  <div
                    className="faq-a"
                    style={{ maxHeight: openFaq === i ? 260 : 0 }}
                  >
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FORM */}
      <section className="form-section" id="assessment">
        <div className="wrap form-grid">
          <div className="form-intro">
            <span className="eyebrow light">
              <i />
              {t.form.eyebrow}
            </span>
            <h2>{t.form.title}</h2>
            <p>{t.form.body}</p>
            <ul className="form-points">
              {t.form.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          {formState.status === "success" ? null : (
          <form action={formAction}>
            {formState.status === "error" && formState.message && (
              <p className="form-alert">{formState.message}</p>
            )}
            <input type="hidden" name="locale" value={locale} />
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
            {/* Honeypot — hidden from real visitors, bots tend to fill every field. */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="company_website">{t.form.honeypot}</label>
              <input
                id="company_website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <input type="hidden" name="charge_time" value={selected.label} readOnly />
            <div className="form-row form-row-name">
              <div className="field">
                <label htmlFor="salutation">{t.form.salutation}</label>
                <select id="salutation" name="salutation" required defaultValue="" disabled={submitting}>
                  <option value="" disabled>-</option>
                  {salutations.map((s) => (
                    <option key={s} value={s}>
                      {optionLabel(options.salutations, s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="full_name">{t.form.fullName}</label>
                <input id="full_name" name="full_name" required disabled={submitting} />
              </div>
              <div className="field">
                <label htmlFor="phone">{t.form.mobile}</label>
                <PhoneField id="phone" locale={locale} required disabled={submitting} />
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="email">{t.form.email}</label>
                <input id="email" name="email" type="email" required disabled={submitting} />
              </div>
              <div className="field">
                <label htmlFor="state">{t.form.state}</label>
                <select id="state" name="state" required defaultValue="" disabled={submitting}>
                  <option value="" disabled>
                    {t.form.statePlaceholder}
                  </option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {optionLabel(options.states, s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="monthly_bill_range">{t.form.bill}</label>
                <select id="monthly_bill_range" name="monthly_bill_range" required defaultValue="" disabled={submitting}>
                  <option value="" disabled>
                    {t.form.billPlaceholder}
                  </option>
                  {billRanges.map((s) => (
                    <option key={s} value={s}>
                      {optionLabel(options.billRanges, s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="property_type">{t.form.propertyType}</label>
                <select id="property_type" name="property_type" required defaultValue="" disabled={submitting}>
                  <option value="" disabled>
                    {t.form.propertyTypePlaceholder}
                  </option>
                  {propertyTypes.map((s) => (
                    <option key={s} value={s}>
                      {optionLabel(options.propertyTypes, s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="electric_supply">{t.form.supply}</label>
                <select id="electric_supply" name="electric_supply" required defaultValue="" disabled={submitting}>
                  <option value="" disabled>{t.form.supplyPlaceholder}</option>
                  {electricSupply.map((s) => (
                    <option key={s} value={s}>
                      {optionLabel(options.supply, s)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="preferred_language">{t.form.language}</label>
                <select id="preferred_language" name="preferred_language" defaultValue="English" disabled={submitting}>
                  {languages.map((s) => (
                    <option key={s} value={s}>
                      {optionLabel(options.languages, s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {!!customFields?.length && (
              <div className="form-row">
                {customFields.map((f) => (
                  <div className="field" key={f.key}>
                    <label htmlFor={f.key}>{f.label}</label>
                    <select id={f.key} name={f.key} required defaultValue="" disabled={submitting}>
                      <option value="" disabled>-</option>
                      {f.values.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
            {TURNSTILE_SITE_KEY && (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
                <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
              </>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? t.form.submitting : t.form.submit}
              {!submitting && <ArrowIcon />}
            </button>
            <p className="form-legal">{t.form.legal} <a href={localePath(locale, "/privacy")} target="_blank" className="underline">{PRIVACY_POLICY[locale].formLink}</a></p>
          </form>
          )}
        </div>
      </section>

      <Footer locale={locale} t={dict.footer} nav={dict.header.nav} />
    </>
  );
}
