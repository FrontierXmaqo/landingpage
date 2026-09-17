/**
 * Net-new About page copy that has no trilingual dictionary entry yet.
 * English only for now, deliberately — same reasoning as the C&I page's own
 * content.ts: everything else on this page stays in lib/i18n/dictionaries,
 * but this section hasn't been signed off for BM/CN yet, so it lives here
 * rather than as a half-translated dictionary entry.
 */

export const SOLUTIONS = [
  { title: "Residential Solar", body: "Turnkey EPC rooftop solar for homes, sized around your TNB bill and your roof." },
  { title: "EV Charging", body: "Solar-powered home EV charging, so the electrons your car uses come off your own roof." },
  { title: "Commercial & Industrial", body: "EPC, PPA and Zero Capex solar for factories, warehouses and offices, 50kWp to 5,000kWp+." },
  { title: "Battery Storage (BESS)", body: "Battery energy storage for maximum demand management and peak shaving." },
];

/** 70% / 78.2% figures are MAQO's own published marketing metrics (maqosolar.com/about-us); the rest are already used elsewhere on this site. */
export const ACHIEVEMENT_STATS = [
  { value: "1,000+", label: "Homeowners & businesses served" },
  { value: "70%", label: "Avg. operational cost reduction" },
  { value: "78.2%", label: "Cleaner energy generated" },
  { value: "25-Yr", label: "Panel performance warranty" },
];

/** Real installs, same photos already used on the live C&I project carousel. */
export const PROOF_PROJECTS = [
  { title: "Amcorp Gemas Solar Farm", image: "/projects/amcorp-gemas.webp", big: true },
  { title: "Spritzer", image: "/projects/spritzer.webp" },
  { title: "Bermaz", image: "/projects/bermaz.webp" },
  { title: "1DOC Medical", image: "/projects/1doc-medical.webp" },
  { title: "Surau At-Taqwa", image: "/projects/surau-at-taqwa.webp" },
];

export const FINAL_CTA_SECONDARY = "Talk to Our Team";
