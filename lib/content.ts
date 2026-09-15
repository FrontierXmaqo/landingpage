// Shared content constants pulled from the old get.maqosolar.com landing page
// (visuals, testimonials, achievements, footer info) and the new ATAP prototype
// (layout, packages, FAQ, process).

export const OLD_SITE_IMAGES = {
  logo:
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/6717ae8a5616d5183447846f.png",
  // Self-hosted for the same reason as the partner logos below: this is the
  // LCP image on mobile, and hotlinking it meant the browser waited on two
  // external services (a GoHighLevel media path, re-encoded by LeadConnector's
  // image CDN) before the largest element could paint. Serving it from /public
  // also means a clear-out of the old site's media library cannot silently
  // empty the hero.
  heroHouse: "/hero-rooftop.webp",
  billBefore:
    "https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/68e73b88a265ecb57675ca51.png",
  billAfter:
    "https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/68e73b88468f55099ab13285.png",
  clientLogos: [
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/6717629951db6138366d079a.png",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/671764074de1e77429b330d9.png",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/671762cf82c33c6181e6fb88.png",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/6717646b3a21fb78af494e25.png",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/67176495a3b2c4043dab9a1f.png",
  ],
  gallery: [
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e053aa80b446d0fbdc1c19.jpg",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e0691c190683601a8e9061.jpg",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e06c1f93c88e42c38b9267.jpg",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e0557ddb7c222f717e142f.jpg",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e05a1080b446d0fbdd9bb8.jpg",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e05b3ddb7c222f717f67bc.jpeg",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e05ba893c88e42c388622c.jpg",
    "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/RxbwqsL86moAQoTiBTtV/media/69e05c4cdb7c222f717f9f0e.jpg",
  ],
};

export const CREDENTIALS = [
  "ST Class A",
  "CIDB G7",
  "SEDA Registered",
  "ISO 9001:2015",
];

// Self-hosted in public/logos: these were hotlinked from each manufacturer's own
// CMS, on upload paths carrying build timestamps and dates, so any redesign on
// their side dropped a logo from the strip with nothing to notice it by.
// Livoltek publishes only a wordmark, which at the strip's 36px box is an
// unreadable smudge next to the same name already set in text — so it carries
// no logo and renders as the name alone.
export const BRAND_LOGOS: { name: string; logo?: string }[] = [
  { name: "AIKO", logo: "/logos/aiko.png" },
  { name: "Huawei", logo: "/logos/huawei.png" },
  { name: "FoxESS", logo: "/logos/foxess.png" },
  { name: "LIVOLTEK" },
  { name: "Sigenergy", logo: "/logos/sigenergy.png" },
];

export const SOLAR_OPTIONS = [
  {
    name: "Grid Export (NEM)",
    function: "Export excess solar energy to TNB for bill credits",
    benefit: "Reduce electricity bill through energy export",
    bestFor: "Homes or businesses with stable grid connection",
  },
  {
    name: "Battery Storage",
    function: "Store excess solar energy for night or backup use",
    benefit: "Use solar power 24/7, even during blackout",
    bestFor: "Areas with frequent power outages or energy independence goals",
  },
];

export const SOLAR_CALC_CONFIG = {
  tariffTierThresholdKwh: 1500,
  tariffBelowThresholdPerKwh: 0.4443,
  tariffAboveThresholdPerKwh: 0.5443,
  suriaRebatePerKwac: 600,
  suriaRebateCap: 3000,
  maqoAnniversaryRebateFlat: 1000,
  maqoAnniversaryRebateValidUntil: "31 October 2026",
};

/** Fallback for the EV landing page's calculator, mirrored in Supabase's
 * `ev_calculator_config` table (see lib/publishedContent.ts) — used only if
 * that table is empty or unreachable. */
export const EV_CALC_DEFAULTS = {
  ratePerKwh: 0.44,
  avgKwhPerKwpMonth: 1463,
  referenceSystemKwp: 14.3,
  kwpPerPanel: 0.65,
  minSystemKwp: 4,
  minMonthlyBill: 15,
  offsetDayPercent: 80,
  offsetNightPercent: 90,
  offsetMixedPercent: 85,
};

export type SolarPackage = {
  kwp: number;
  panels: number;
  inverterModel: string;
  kWac: number;
  dcAcRatio: number;
  monthlyGenerationKwh: number;
  standardSellingPrice: number;
  monthlySavingsBelowThreshold: number;
  monthlySavingsAboveThreshold: number;
  paybackYearsBelowThreshold: number;
  paybackYearsAboveThreshold: number;
};

export const SOLAR_PACKAGES_HYBRID: SolarPackage[] = [
  { kwp: 5.2, panels: 8, inverterModel: "Sigen Hybrid 5.0 SP2", kWac: 5.0, dcAcRatio: 1.04, monthlyGenerationKwh: 537.77, standardSellingPrice: 15800, monthlySavingsBelowThreshold: 155, monthlySavingsAboveThreshold: 171, paybackYearsBelowThreshold: 8.55, paybackYearsAboveThreshold: 7.75 },
  { kwp: 5.85, panels: 9, inverterModel: "Sigen Hybrid 5.0 SP2", kWac: 5.0, dcAcRatio: 1.17, monthlyGenerationKwh: 604.99, standardSellingPrice: 16600, monthlySavingsBelowThreshold: 174, monthlySavingsAboveThreshold: 192, paybackYearsBelowThreshold: 7.85, paybackYearsAboveThreshold: 7.12 },
  { kwp: 6.5, panels: 10, inverterModel: "Sigen Hybrid 5.0 SP2", kWac: 5.0, dcAcRatio: 1.3, monthlyGenerationKwh: 672.21, standardSellingPrice: 17300, monthlySavingsBelowThreshold: 194, monthlySavingsAboveThreshold: 214, paybackYearsBelowThreshold: 7.39, paybackYearsAboveThreshold: 6.7 },
  { kwp: 7.15, panels: 11, inverterModel: "Sigen Hybrid 5.0 SP2", kWac: 5.0, dcAcRatio: 1.43, monthlyGenerationKwh: 739.43, standardSellingPrice: 18000, monthlySavingsBelowThreshold: 213, monthlySavingsAboveThreshold: 235, paybackYearsBelowThreshold: 6.92, paybackYearsAboveThreshold: 6.28 },
];

export const SOLAR_PACKAGES_NEO: SolarPackage[] = [
  { kwp: 6.5, panels: 10, inverterModel: "Sigen Neo — SigenStor NEO EC 5.0 SP", kWac: 5.0, dcAcRatio: 1.3, monthlyGenerationKwh: 672.21, standardSellingPrice: 19000, monthlySavingsBelowThreshold: 193, monthlySavingsAboveThreshold: 213, paybackYearsBelowThreshold: 8.2, paybackYearsAboveThreshold: 7.44 },
  { kwp: 7.8, panels: 12, inverterModel: "Sigen Neo — SigenStor NEO EC 6.0 TP", kWac: 6.0, dcAcRatio: 1.3, monthlyGenerationKwh: 806.65, standardSellingPrice: 22300, monthlySavingsBelowThreshold: 232, monthlySavingsAboveThreshold: 256, paybackYearsBelowThreshold: 8.01, paybackYearsAboveThreshold: 7.26 },
  { kwp: 9.1, panels: 14, inverterModel: "Sigen Neo — SigenStor NEO EC 8.0 TP", kWac: 8.0, dcAcRatio: 1.14, monthlyGenerationKwh: 941.09, standardSellingPrice: 24300, monthlySavingsBelowThreshold: 270, monthlySavingsAboveThreshold: 298, paybackYearsBelowThreshold: 7.5, paybackYearsAboveThreshold: 6.8 },
  { kwp: 9.8, panels: 15, inverterModel: "Sigen Neo — SigenStor NEO EC 8.0 TP", kWac: 8.0, dcAcRatio: 1.22, monthlyGenerationKwh: 1008.31, standardSellingPrice: 25500, monthlySavingsBelowThreshold: 294, monthlySavingsAboveThreshold: 324, paybackYearsBelowThreshold: 7.24, paybackYearsAboveThreshold: 6.56 },
  { kwp: 10.4, panels: 16, inverterModel: "Sigen Neo — SigenStor NEO EC 8.0 TP", kWac: 8.0, dcAcRatio: 1.3, monthlyGenerationKwh: 1075.53, standardSellingPrice: 26000, monthlySavingsBelowThreshold: 313, monthlySavingsAboveThreshold: 346, paybackYearsBelowThreshold: 6.93, paybackYearsAboveThreshold: 6.26 },
  { kwp: 11.7, panels: 18, inverterModel: "Sigen Neo — SigenStor NEO EC 10.0 TP", kWac: 10.0, dcAcRatio: 1.17, monthlyGenerationKwh: 1209.98, standardSellingPrice: 27300, monthlySavingsBelowThreshold: 351, monthlySavingsAboveThreshold: 387, paybackYearsBelowThreshold: 6.49, paybackYearsAboveThreshold: 5.88 },
  { kwp: 12.4, panels: 19, inverterModel: "Sigen Neo — SigenStor NEO EC 10.0 TP", kWac: 10.0, dcAcRatio: 1.23, monthlyGenerationKwh: 1277.2, standardSellingPrice: 28300, monthlySavingsBelowThreshold: 368, monthlySavingsAboveThreshold: 407, paybackYearsBelowThreshold: 6.4, paybackYearsAboveThreshold: 5.79 },
  { kwp: 13.0, panels: 20, inverterModel: "Sigen Neo — SigenStor NEO EC 10.0 TP", kWac: 10.0, dcAcRatio: 1.3, monthlyGenerationKwh: 1344.42, standardSellingPrice: 29500, monthlySavingsBelowThreshold: 387, monthlySavingsAboveThreshold: 427, paybackYearsBelowThreshold: 6.35, paybackYearsAboveThreshold: 5.76 },
  { kwp: 14.3, panels: 22, inverterModel: "Sigen Neo — SigenStor NEO EC 10.0 TP", kWac: 10.0, dcAcRatio: 1.43, monthlyGenerationKwh: 1478.86, standardSellingPrice: 31500, monthlySavingsBelowThreshold: 423, monthlySavingsAboveThreshold: 469, paybackYearsBelowThreshold: 6.2, paybackYearsAboveThreshold: 5.6 },
  { kwp: 15.6, panels: 24, inverterModel: "Sigen Neo — SigenStor NEO EC 12.0 TP", kWac: 12.0, dcAcRatio: 1.3, monthlyGenerationKwh: 1613.3, standardSellingPrice: 32800, monthlySavingsBelowThreshold: 461, monthlySavingsAboveThreshold: 509, paybackYearsBelowThreshold: 5.93, paybackYearsAboveThreshold: 5.37 },
  { kwp: 16.9, panels: 26, inverterModel: "Sigen Neo — SigenStor NEO EC 12.0 TP", kWac: 12.0, dcAcRatio: 1.41, monthlyGenerationKwh: 1747.74, standardSellingPrice: 34800, monthlySavingsBelowThreshold: 498, monthlySavingsAboveThreshold: 550, paybackYearsBelowThreshold: 5.82, paybackYearsAboveThreshold: 5.27 },
  { kwp: 18.2, panels: 28, inverterModel: "Sigen Neo — SigenStor NEO EC 15.0 TP", kWac: 15.0, dcAcRatio: 1.21, monthlyGenerationKwh: 1882.18, standardSellingPrice: 36500, monthlySavingsBelowThreshold: 534, monthlySavingsAboveThreshold: 590, paybackYearsBelowThreshold: 5.7, paybackYearsAboveThreshold: 5.16 },
  { kwp: 19.5, panels: 30, inverterModel: "Sigen Neo — SigenStor NEO EC 15.0 TP", kWac: 15.0, dcAcRatio: 1.3, monthlyGenerationKwh: 2016.63, standardSellingPrice: 38200, monthlySavingsBelowThreshold: 571, monthlySavingsAboveThreshold: 630, paybackYearsBelowThreshold: 5.57, paybackYearsAboveThreshold: 5.05 },
  { kwp: 20.8, panels: 32, inverterModel: "Sigen Neo — SigenStor NEO EC 15.0 TP", kWac: 15.0, dcAcRatio: 1.39, monthlyGenerationKwh: 2151.07, standardSellingPrice: 40000, monthlySavingsBelowThreshold: 607, monthlySavingsAboveThreshold: 671, paybackYearsBelowThreshold: 5.49, paybackYearsAboveThreshold: 4.97 },
];

export type Product = {
  id: string;
  category: "Solar Panels" | "Inverters" | "Batteries";
  brand: string;
  name: string;
  model: string;
  tagline: string;
  images: string[];
  shortDescription: string;
  overview: string;
  features: string[];
  benefits: string[];
  specs: [string, string][];
};

export const PRODUCT_CATEGORIES: Product["category"][] = [
  "Solar Panels",
  "Inverters",
  "Batteries",
];

export const PRODUCTS: Product[] = [
  {
    id: "aiko-panel",
    category: "Solar Panels",
    brand: "AIKO",
    name: "AIKO ABC Solar Panel",
    model: "AIKO-G655-MCH72Mw · Comet 2U",
    tagline: "The panel that works harder, looks better, and lasts longer",
    images: ["/products/aikoPanel.jpg"],
    shortDescription: "World's highest-rated panel efficiency, in a sleek all-black finish that still performs in the shade.",
    overview: "AIKO's ABC back-contact cells deliver the world's highest-rated panel efficiency in a clean, all-black finish that keeps performing even in shade.",
    features: [
      "655W n-type ABC module, 24.2% efficiency — world's highest-rated (TaiyangNews, Jan 2025)",
      "Runs cooler for less degradation: 101.3°C vs 146.9°C on a comparable TOPCon module",
      "Red Dot Design Award 2023 for its clean all-black finish",
    ],
    benefits: [
      "Up to 94.3% output retained under partial shading vs ~66% for standard panels",
      "Premium all-black look with no visible gridlines",
      "30-year performance, 15-year product warranty",
    ],
    specs: [
      ["Model", "AIKO-G655-MCH72Mw (Comet 2U)"],
      ["Cell technology", "N-type ABC, half-cell, back contact"],
      ["Wafer size / cell count", "182mm / 144 cells"],
      ["Rated power", "655 W"],
      ["Module efficiency", "24.2%"],
      ["Performance warranty", "30 years"],
      ["Product warranty", "15 years"],
    ],
  },
  {
    id: "sigen-hybrid-inverter",
    category: "Inverters",
    brand: "Sigenergy",
    name: "Sigen Hybrid Inverter",
    model: "SigenHybridInverter · SP2 / TP2",
    tagline: "Slim. Silent. Strong.",
    images: ["/products/sigenHybridInverter.png"],
    shortDescription: "A slim, silent inverter that pairs with solar now and a battery whenever you're ready.",
    overview: "Built on Silicon Carbide power electronics, the Sigen Hybrid Inverter runs at 99% efficiency in a slim, silent, weatherproof body — install solar-only now and add a battery later.",
    features: [
      "99.0% efficiency via Silicon Carbide (SiC) electronics",
      "Fanless, just 25dB, IP66 weatherproof (-30°C to 60°C)",
      "Add a Sigen Battery anytime — no equipment swap needed",
    ],
    benefits: [
      "More of your solar energy actually reaches your home",
      "Silent, compact — fits discreetly against any wall",
      "Built for Malaysia's heat, humidity and monsoon rain",
    ],
    specs: [
      ["Efficiency", "99.0% (Silicon Carbide / SiC)"],
      ["Noise level", "25 dB (fanless)"],
      ["Enclosure", "99mm sleek die-cast metal body"],
      ["Ingress protection", "IP66 — dust and jet-water sealed"],
      ["Operating temperature", "-30°C to 60°C"],
      ["Expansion", "Add a Sigen Battery at any time"],
      ["Compatibility", "EV chargers, generators, select third-party inverters"],
    ],
  },
  {
    id: "foxess-hybrid-inverter",
    category: "Inverters",
    brand: "FoxESS",
    name: "FoxESS Hybrid Inverter",
    model: "AC & Hybrid variants",
    tagline: "High-efficiency inverter performance, built for easy installation",
    images: ["/products/foxessHybridInverter.png"],
    shortDescription: "A tough, outdoor-rated inverter built for fast installation and easy remote monitoring.",
    overview: "The FoxESS Hybrid Inverter delivers high round-trip efficiency in a tough, outdoor-rated body, with fast plug-and-play installation and remote monitoring via FoxCloud.",
    features: [
      "Up to 98.5% PV-to-battery, 97% battery-to-AC efficiency",
      "IP65 outdoor-rated, fanless natural cooling",
      "Expandable up to 18 batteries in series",
    ],
    benefits: [
      "Less solar energy lost between panel and battery",
      "Weatherproof, built for outdoor wall mounting",
      "Monitor and diagnose remotely via the FoxCloud app",
    ],
    specs: [
      ["Variants", "AC and Hybrid, multiple battery sizing options"],
      ["Max charge efficiency (PV → battery)", "98.5%"],
      ["Max discharge efficiency (battery → AC)", "97%"],
      ["Ingress protection", "IP65 — suitable for outdoor installation"],
      ["Parallel operation", "On-grid: 2–10 units · Off-grid: 2–7 units"],
      ["Battery expansion", "Up to 18 batteries in series"],
      ["Monitoring", "FoxCloud 2.0 app (iOS & Android)"],
      ["Product warranty", "10 years"],
    ],
  },
  {
    id: "sigen-storneo",
    category: "Batteries",
    brand: "Sigenergy",
    name: "SigenStor Neo",
    model: "AI-powered all-in-one energy storage",
    tagline: "Five systems, one cabinet",
    images: ["/products/sigenStorNeo.png"],
    shortDescription: "One sleek cabinet for storage, backup power and AI-driven savings — no scattered boxes.",
    overview: "SigenStor Neo packs energy management, inverter, battery and backup into one sleek cabinet, using AI to learn your home's habits and optimise savings automatically.",
    features: [
      "5-in-1 cabinet: EMS, inverter, battery PCS, battery pack, backup",
      "Modular and stackable — add capacity anytime",
      "0ms load-side disruption when backup power switches in",
    ],
    benefits: [
      "One compact cabinet instead of separate boxes",
      "Expand storage later without replacing what you own",
      "AI-driven scheduling keeps optimising your savings",
    ],
    specs: [
      ["Configuration", "5-in-1: EMS, PV inverter, battery PCS, battery pack, backup module"],
      ["Expansion", "Modular, stackable battery packs (mixed old/new packs supported)"],
      ["Backup switching", "0 ms load-side disruption"],
      ["Safety", "Continuous cell monitoring with fire prevention"],
      ["App", "mySIGEN App — AI Mode, AI Assistant, Energy Sankey diagram, 10-second interval monitoring"],
      ["Product warranty", "10 years"],
      ["Global installed base", "60+ countries"],
    ],
  },
  {
    id: "foxess-ep-battery",
    category: "Batteries",
    brand: "FoxESS",
    name: "FoxESS EP6 / EP12 Battery",
    model: "EP6 · EP12",
    tagline: "Scalable battery storage that grows with your home",
    images: ["/products/foxessEP6Battery.png", "/products/foxessEP12Battery.png"],
    shortDescription: "Modular battery storage that starts small and grows with your home's needs.",
    overview: "The FoxESS EP6 and EP12 are modular batteries that pair with the FoxESS Hybrid Inverter — start small and add units in parallel as your needs grow.",
    features: [
      "EP6 scales to 23.04kWh, EP12 to 46.08kWh",
      "90% depth of discharge on both models",
      "Compact floor or wall mounting",
    ],
    benefits: [
      "Start small and expand storage later",
      "More of every kWh stored is actually usable",
      "Backed by a 10-year product warranty",
    ],
    specs: [
      ["EP6 dimensions (W×H×D)", "380 × 640 × 185 mm"],
      ["EP6 weight", "51 kg"],
      ["EP6 max scalable capacity", "23.04 kWh"],
      ["EP12 dimensions (W×H×D)", "710 × 640 × 185 mm"],
      ["EP12 weight", "98 kg"],
      ["EP12 max scalable capacity", "46.08 kWh"],
      ["Depth of discharge", "90% (both models)"],
      ["Product warranty", "10 years"],
    ],
  },
];

export const TESTIMONIALS = [
  { quote: "Our TNB bill dropped from RM680 to under RM90 a month. The MAQO team handled the whole TNB application for us.", name: "Mr. Tan", location: "Subang Jaya" },
  { quote: "Installation took two days, very tidy work. The monitoring app makes it easy to see how much we are saving.", name: "Puan Aina", location: "Shah Alam" },
  { quote: "Compared three companies — MAQO gave the clearest quote and answered every question about warranty upfront.", name: "Mr. Lim", location: "Kajang" },
  { quote: "I recently had a solar system installed by MAQO Solar Malaysia. The team was punctual, professional, and thorough — they explained everything clearly. Despite some issues with the inverters, the team quickly resolved them, even on a Sunday. Highly recommend MAQO Solar for anyone considering solar energy.", name: "LSY", location: "Homeowner" },
  { quote: "Installation time is fast (1.5 days) from start to electrical hook-up to main DB. Work quality is good, no stain or hand mark on the wall. Happy with the MAQO team for their explanation, single line drawing, and prompt execution.", name: "Azita Azwan", location: "Surau At-Taqwa, 6.06kWp system" },
  { quote: "Team is very knowledgeable, efficient, and shared info on Solar PV. A crane was provided to hoist up the panels and avoid roof tile damage. My monthly TNB bill has reduced by RM350 on average — a true turnkey process from SEDA approval to NEM meter with TNB.", name: "Alwana", location: "Shah Alam" },
];

const OFFICE_ADDRESS =
  "27, Jalan TPP 1/1, Taman Perindustrian Puchong, 47100 Puchong, Selangor";

export const CONTACT = {
  email: "admin@maqo.asia",
  emailHref: "mailto:admin@maqo.asia",
  office: "603-8069 1706",
  officeHref: "tel:+60380691706",
  address: OFFICE_ADDRESS,
  mapsHref: `https://maps.app.goo.gl/a8KfogLqervhyhC99/?api=1&query=${encodeURIComponent(
    OFFICE_ADDRESS
  )}`,
};
