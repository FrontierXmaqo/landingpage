/**
 * Copy and data for the Commercial & Industrial landing page.
 *
 * English only for now, deliberately: the rest of the site keeps its copy in
 * lib/i18n/dictionaries, but marketing has not signed off BM/CN for this page
 * yet. Everything visitor-facing lives here in one place so lifting it into the
 * dictionaries later is a move, not a rewrite.
 */

export const CI_META = {
  title: "Commercial & Industrial Solar Malaysia | MAQO Solar",
  description:
    "Cut your company's electricity bill by up to 70% with MAQO Solar. ST Class A & CIDB G7 certified EPCC, zero-capex PPA options and GITA incentives for factories, warehouses and commercial buildings.",
};

export const HERO = {
  eyebrow: "Commercial & Industrial Solar Solutions",
  title: "Cut Your Company's Electric Bill & Save Up to 70%",
  body:
    "Beat rising tariffs and lock in low energy costs for the next 25 years with customized solar PV solutions.",
  valueProps: [
    "Zero Upfront Capital Options",
    "GITA Tax Incentives",
    "Tier-1 Solar Technology",
  ],
  primaryCta: "Get Your Free Assessment",
  secondaryCta: "See our projects",
};

/**
 * Client roster supplied by marketing. Rendered as wordmarks, not images —
 * the repo carries no logo files for these brands. Drop PNGs into
 * /public/logos/clients and add a `logo` key here to switch to images.
 */
export const CLIENTS = [
  "Spritzer",
  "DHL",
  "Scientex",
  "A&W",
  "Mazda",
  "Xpeng",
  "Press Metal",
  "Delloyd",
];

export const TRUST_STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "100+", label: "Commercial Installs" },
  { value: "100%", label: "SEDA / TNB Approved" },
];

/**
 * TO BE CONFIRMED BEFORE LAUNCH — the client names are real, but the capacity
 * and savings figures below are the indicative examples from the campaign
 * brief, not verified project records. Marketing must replace each `capacity`,
 * `outcome` and `location` with the signed-off number for that site before
 * this page goes live, and add a real photo to /public.
 */
export const PROJECTS = [
  {
    client: "Scientex",
    title: "Manufacturing Plant Rooftop Solar",
    tag: "Manufacturing",
    capacity: "500 kWp",
    location: "Peninsular Malaysia",
    outcome: "65% reduction in monthly energy bill",
    detail:
      "Full rooftop build-out across the production hall, engineered around a live 24-hour manufacturing operation with no downtime to the line.",
  },
  {
    client: "DHL",
    title: "Warehouse & Logistics Hub",
    tag: "Logistics & Warehousing",
    capacity: "1.2 MWp",
    location: "Klang Valley",
    outcome: "On-grid system offsetting daytime distribution load",
    detail:
      "Large-span warehouse roof converted into a generating asset, sized to the site's daytime profile so nearly every unit produced is consumed on site.",
  },
  {
    client: "Din Tai Fung",
    title: "Retail & Commercial Complex",
    tag: "Retail & Commercial",
    capacity: "350 kWp",
    location: "Klang Valley",
    outcome: "BESS-ready for peak demand shaving",
    detail:
      "Designed with spare DC headroom and switchgear provisioning so a battery energy storage system can be added later without re-engineering.",
  },
];

export const PROJECT_VIDEO_URL = "https://www.youtube.com/watch?v=mqUqlW1gC_g";

export const PILLARS = [
  {
    icon: "tax" as const,
    title: "GITA Capital Allowance",
    body:
      "Qualifying solar assets attract the Green Investment Tax Allowance, offsetting a substantial share of your capital outlay against statutory income. We prepare the documentation your tax agent needs.",
  },
  {
    icon: "wallet" as const,
    title: "PPA / Solar Leasing",
    body:
      "RM0 upfront CAPEX. MAQO funds, builds, owns and maintains the system on your roof; you simply buy the electricity it produces at a rate below the tariff, from day one.",
  },
  {
    icon: "shield" as const,
    title: "Tier-1 Equipment & 25-Year Warranty",
    body:
      "AIKO back-contact panels and Huawei or Sungrow inverters only — Bloomberg Tier-1 manufacturers, backed by a 25-year performance warranty on the modules.",
  },
  {
    icon: "gear" as const,
    title: "End-to-End EPCC",
    body:
      "Engineering, Procurement, Construction and Commissioning under one contract, delivered by our own licensed wiremen and chargemen. No subcontracting of the critical works.",
  },
];

export const CREDENTIAL_LINE = [
  "ST Class A",
  "CIDB G7",
  "SEDA Registered",
  "ISO 9001:2015",
];

export const FINAL_CTA = {
  title: "Ready to Lock in Your Energy Costs for the Next 25 Years?",
  body:
    "Send us a recent TNB bill and a roof plan. We will come back with an indicative system size, an ROI projection and the funding options open to your business.",
  cta: "Get Free Solar Assessment & ROI Quote",
};
