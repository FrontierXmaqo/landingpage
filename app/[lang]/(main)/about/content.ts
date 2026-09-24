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

/**
 * Stops on the Our Story road. `scene` draws an illustration on the inner side
 * of that stop's bend; `badges` render as pills under the body.
 */
export type StoryMilestone = {
  year: string;
  title: string;
  body: string;
  badges?: string[];
  scene?: "house" | "factory";
};

export const STORY_MILESTONES: StoryMilestone[] = [
  {
    year: "2013",
    title: "Company Foundation",
    body: "Founded as MAQO Solar in Puchong, Selangor by Managing Director Kong Kok King (M.Eng, University of Tokyo), providing residential solar installations across Malaysia.",
  },
  {
    year: "2014",
    title: "2MW Supply Agreement & Incorporation",
    body: "Secured a 2MW solar module procurement contract with Yingli Green Energy in January, then incorporated as MAQO Engineering Sdn. Bhd. on 26 August.",
  },
  {
    year: "2015",
    title: "Residential Focus & SEDA Accreditation",
    body: "Built an in-house engineering team registered with SEDA as certified Grid-Connected PV (GCPV) designers and installers.",
    scene: "house",
  },
  {
    year: "2016–2019",
    title: "C&I Expansion & Smart Monitoring",
    body: "Expanded into turnkey Commercial & Industrial solar under NEM and GITA incentives, adding IoT sensors and app-based monitoring for 24/7 real-time system tracking.",
    scene: "factory",
  },
  {
    year: "2020",
    title: "Major Licences & Industry Awards",
    body: "Achieved CIDB Grade 7 and Suruhanjaya Tenaga Class A status, and won the SME100 Fast Moving Companies award and a Global Business Leadership Award for Excellence in Renewable Energy.",
    badges: ["CIDB G7", "ST Class A", "SME100 Fast Moving Companies", "Global Business Leadership Award"],
  },
  {
    year: "2021–2024",
    title: "ISO 9001 & 300+ Projects",
    body: "Earned ISO 9001 certification and surpassed 300 installations across residential, commercial rooftop, off-grid battery and Large-Scale Solar projects.",
  },
  {
    year: "Present",
    title: "Complete Energy Management",
    body: "A leading turnkey solar PV contractor partnering with Tier-1 module manufacturers, offering up to 25-year performance warranties and long-term O&M packages.",
  },
];
