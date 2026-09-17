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
/** Fallback roster, used when the CMS table is empty or unreachable. Logos are
 *  CMS-only — the built-in list is names, which is what the tiles showed before. */
export const CLIENTS = [
  { name: "Spritzer" },
  { name: "DHL" },
  { name: "Scientex" },
  { name: "A&W" },
  { name: "Mazda" },
  { name: "Xpeng" },
  { name: "Press Metal" },
  { name: "Delloyd" },
];

export const TRUST_STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "100+", label: "Commercial Installs" },
  { value: "100%", label: "SEDA / TNB Approved" },
];

export type Project = {
  /** Free text — see projectIcon() in icons.ts for how an unknown one renders. */
  tag: string;
  /** As published on the original page — "1,071 kWp", "10.25 MWp". Kept as a
   *  string because the unit changes between kWp and MWp. */
  capacity: string;
  client: string;
  /** Omitted where the count was never published (the Gemas solar farm). */
  panels?: string;
  /** Path under /public. While this is undefined the card falls back to a
   *  branded tile showing the category icon and the capacity, so the section
   *  looks deliberate rather than broken.
   *
   *  To add the real photos: save each one into public/projects/ under the
   *  filename named in the comment beside it and set `image` to that path.
   *  Prefer .webp at roughly 800x520; next/image handles the rest. */
  image?: string;
  imageAlt: string;
  /** Shown in the project dialog under the specs. Left empty until marketing
   *  supplies a signed-off line per site — an empty field simply renders
   *  nothing rather than a placeholder sentence. */
  summary?: string;
};

/**
 * Fallback copy of the six reference projects.
 *
 * These are edited in the CMS now (Admin -> Commercial & Industrial Page), and
 * this list is only what the page renders if Supabase is unreachable or the
 * table is empty. Kept in sync with the seeded rows so a fallback render looks
 * like the real page rather than an empty section.
 */
export const PROJECTS: Project[] = [
  {
    tag: "Factory",
    capacity: "1,071 kWp",
    client: "Spritzer",
    panels: "2,380 solar panels",
    image: "/projects/spritzer.webp",
    imageAlt: "Aerial view of the Spritzer factory roof covered in solar panels",
  },
  {
    tag: "Car Showroom",
    capacity: "159.72 kWp",
    client: "Bermaz Motor Trading",
    panels: "264 solar panels",
    image: "/projects/bermaz.webp",
    imageAlt: "Aerial view of solar panels across the roof of the Bermaz Motor Trading XPENG showroom",
  },
  {
    tag: "School",
    capacity: "185.13 kWp",
    client: "SRJK (C) Khe Beng",
    panels: "306 solar panels",
    image: "/projects/khe-beng.webp",
    imageAlt: "Aerial view of a newly installed solar array on the roof of SRJK (C) Khe Beng",
  },
  {
    tag: "Shoplot",
    capacity: "26 kWp",
    client: "1 Doc Medical Group Sdn Bhd",
    panels: "40 solar panels",
    image: "/projects/1doc-medical.webp",
    imageAlt: "Solar panels on the shoplot roof of 1 Doc Medical Group",
  },
  {
    tag: "Mosque",
    capacity: "6.96 kWp",
    client: "Surau At-Taqwa",
    panels: "12 solar panels",
    image: "/projects/surau-at-taqwa.webp",
    imageAlt: "Solar panels on the pitched roof of Surau At-Taqwa",
  },
  {
    tag: "Solar Farm",
    capacity: "10.25 MWp",
    client: "Amcorp Gemas Solar Plant",
    image: "/projects/amcorp-gemas.webp",
    imageAlt: "Rows of ground-mounted solar panels at the Amcorp Gemas solar plant",
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

// Hero tiles. Add `logo` (a path under /public) once the official marks are supplied.
export const CREDENTIALS: { mark: string; issuer: string; logo?: string }[] = [
  { mark: "ST Class A", issuer: "Suruhanjaya Tenaga" },
  { mark: "CIDB G7", issuer: "Highest contractor grade" },
  { mark: "SEDA", issuer: "Registered installer" },
  { mark: "ISO 9001:2015", issuer: "Quality managed" },
];

export const FINAL_CTA = {
  title: "Ready to Lock in Your Energy Costs for the Next 25 Years?",
  body:
    "Send us a recent TNB bill and a roof plan. We will come back with an indicative system size, an ROI projection and the funding options open to your business.",
  cta: "Get Free Solar Assessment & ROI Quote",
};
