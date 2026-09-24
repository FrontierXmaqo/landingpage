// Product catalogue for /products-and-services (English; products.cn.ts and
// products.ms.ts hold the translations). Every figure here comes from
// the brand brochures (AIKO USP deck, FoxESS portfolio, Sigenergy SP2/TP2 and
// SigenStor Neo decks). To add a product, append an entry: the card and the
// detail dialog both render from this shape, nothing else needs to change.

import type { Locale } from "@/lib/i18n";
import { PRODUCTS_CN } from "./products.cn";
import { PRODUCTS_MS } from "./products.ms";

export type Category = "panels" | "inverters" | "batteries";

export type Product = {
  id: string;
  category: Category;
  brand: string;
  name: string;
  /** One line on the card. */
  tagline: string;
  /** Up to four short points on the card. */
  highlights: string[];
  images: { src: string; alt: string }[];
  overview: string;
  features: string[];
  benefits: string[];
  specs: { label: string; value: string }[];
  applications: string[];
  faq: { q: string; a: string }[];
};

/** Filter order. Category names per language live in copy.ts. */
export const CATEGORY_ORDER: Category[] = ["panels", "inverters", "batteries"];

export function getProducts(locale: Locale): Product[] {
  return locale === "cn" ? PRODUCTS_CN : locale === "ms" ? PRODUCTS_MS : PRODUCTS;
}

export const PRODUCTS: Product[] = [
  {
    id: "aiko-comet-2u",
    category: "panels",
    brand: "AIKO",
    name: "AIKO Comet 2U 655W",
    tagline: "All-black back-contact panel that keeps producing when part of the roof is shaded.",
    highlights: ["655 W per panel", "24.2% module efficiency", "Holds output under partial shade", "30-year performance warranty"],
    images: [{ src: "/products/aiko-comet-2u-crop.jpg", alt: "AIKO Comet 2U all-black solar panel, front and back" }],
    overview:
      "The Comet 2U uses AIKO's n-type ABC (all back contact) cells, so there are no silver lines across the front. More of each cell catches light, the panel looks clean on the roof, and it runs cooler in strong sun.",
    features: [
      "n-type ABC back-contact cells, half-cut, 144 per panel",
      "655 W rated power at 24.2% efficiency",
      "Keeps working when some cells are shaded",
      "Red Dot design award winner, 2023",
    ],
    benefits: [
      "More power from the same roof space",
      "Leaves, poles and neighbouring walls cost you less output",
      "Stays cooler under Malaysian heat, so output drops less at noon",
      "A tidy all-black roof with no visible grid lines",
    ],
    specs: [
      { label: "Model", value: "AIKO-G655-MCH72Mw" },
      { label: "Cell type", value: "n-type, ABC back contact, half-cell" },
      { label: "Wafer size", value: "182 mm" },
      { label: "Cell count", value: "144" },
      { label: "Rated power", value: "655 W" },
      { label: "Module efficiency", value: "24.2%" },
      { label: "Product warranty", value: "15 years" },
      { label: "Performance warranty", value: "30 years" },
    ],
    applications: ["Home rooftops with limited space", "Roofs with trees or walls casting shade", "Commercial rooftops"],
    faq: [
      {
        q: "How much does shade really affect it?",
        a: "In AIKO's shading test with two shaded cells, the Comet kept 94.3% of its output against 65.9% for a traditional panel.",
      },
      {
        q: "What does the warranty cover?",
        a: "15 years on the product itself and 30 years on power output.",
      },
    ],
  },
  {
    id: "sigen-hybrid-inverter",
    category: "inverters",
    brand: "Sigenergy",
    name: "Sigen Hybrid Inverter",
    tagline: "Slim, fanless inverter. Start with solar now and add a battery whenever you are ready.",
    highlights: ["99.0% max efficiency", "Silent at 25 dB, no fan", "IP66 sealed", "Battery-ready"],
    images: [{ src: "/products/sigen-hybrid-inverter.webp", alt: "Sigenergy hybrid inverter, white front panel" }],
    overview:
      "Sigenergy's hybrid inverter (SP2 single-phase, TP2 three-phase) uses silicon carbide parts to reach 99.0% efficiency in a 99 mm die-cast body. There is no fan, so it runs quietly beside the house.",
    features: [
      "Silicon carbide (SiC) power electronics",
      "Fanless cooling, 25 dB",
      "99 mm slim die-cast metal body",
      "mySIGEN app with 10-second energy flow updates",
    ],
    benefits: [
      "Less energy lost between the panels and your plugs",
      "Quiet enough to mount near living spaces",
      "No need to replace the inverter when you add a Sigen Battery",
      "See where every watt goes, right on your phone",
    ],
    specs: [
      { label: "Models", value: "SP2 (single-phase), TP2 (three-phase)" },
      { label: "Max efficiency", value: "99.0%" },
      { label: "Noise", value: "25 dB, fanless" },
      { label: "Body depth", value: "99 mm" },
      { label: "Protection", value: "IP66 dust and water jet" },
      { label: "Operating temperature", value: "-30°C to 60°C" },
      { label: "Warranty", value: "10 years" },
    ],
    applications: ["Homes going solar first, storage later", "Wall mounting near bedrooms or patios", "Outdoor installs exposed to rain"],
    faq: [
      {
        q: "Can I add a battery later?",
        a: "Yes. Start with the inverter alone and plug in a Sigen Battery any time to add storage and backup.",
      },
      {
        q: "How do I check what the system is doing?",
        a: "The mySIGEN app shows live energy flow, graphs and downloadable reports, and Sigen AI Mode can schedule charging around weather and tariffs.",
      },
    ],
  },
  {
    id: "foxess-hybrid-inverter",
    category: "inverters",
    brand: "FoxESS",
    name: "FoxESS Hybrid Inverter",
    tagline: "Hard-working hybrid inverter with backup power and room to grow.",
    highlights: ["IP65, natural cooling", "EPS backup output", "Runs up to 10 units in parallel", "10-year warranty"],
    images: [{ src: "/products/foxess-hybrid-inverter.webp", alt: "FoxESS hybrid inverter with display panel" }],
    overview:
      "A high-voltage hybrid inverter that manages panels, battery and grid in one unit. It installs plug-and-play with built-in fuse protection and can be paired with more units as your needs grow.",
    features: [
      "High-voltage battery input",
      "EPS function for backup power during outages",
      "Plug-and-play install with built-in fuse protection",
      "Remote monitoring through web portal and FoxCloud app",
    ],
    benefits: [
      "Essential loads keep running when the grid drops",
      "Scale up by adding units instead of replacing one",
      "Rated for outdoor mounting",
      "Settings and data available from anywhere",
    ],
    specs: [
      { label: "Cooling", value: "Natural convection" },
      { label: "Protection", value: "IP65" },
      { label: "On-grid parallel", value: "2 to 10 units" },
      { label: "Off-grid parallel", value: "2 to 7 units" },
      { label: "Battery expansion", value: "Up to 18 batteries in series" },
      { label: "Warranty", value: "10 years" },
    ],
    applications: ["Homes that want outage backup", "Larger homes and small businesses", "Pairing with FoxESS EP batteries"],
    faq: [
      {
        q: "Will it keep my lights on during a blackout?",
        a: "With a battery connected, the EPS output supplies the circuits wired to it while the grid is down.",
      },
      {
        q: "Can the system grow later?",
        a: "Yes. Add batteries, or run 2 to 10 inverters in parallel on-grid.",
      },
    ],
  },
  {
    id: "foxess-ep-battery",
    category: "batteries",
    brand: "FoxESS",
    name: "FoxESS EP6 / EP12 Battery",
    tagline: "Modular battery you can stack in parallel as your usage grows.",
    highlights: ["90% depth of discharge", "EP6 scales to 23.04 kWh", "EP12 scales to 46.08 kWh", "Floor or wall mounting"],
    images: [
      { src: "/products/foxess-ep6.png", alt: "FoxESS EP6 battery, upright white unit" },
      { src: "/products/foxess-ep12.png", alt: "FoxESS EP12 battery, wide white unit" },
    ],
    overview:
      "EP6 and EP12 are the same design in two sizes. Add more units in parallel to build storage up to 23.04 kWh with EP6 or 46.08 kWh with EP12.",
    features: [
      "Modular design, units connect in parallel",
      "90% usable depth of discharge",
      "Floor or wall mounting",
      "IP65 dust and water protection",
    ],
    benefits: [
      "Buy the capacity you need today, add more later",
      "Use nearly all the energy you store",
      "Fits a garage wall or a corner of the floor",
      "Suitable for outdoor installation",
    ],
    specs: [
      { label: "EP6 size (W×H×D)", value: "380 × 640 × 185 mm" },
      { label: "EP6 weight", value: "51 kg" },
      { label: "EP6 max capacity", value: "23.04 kWh" },
      { label: "EP12 size (W×H×D)", value: "710 × 640 × 185 mm" },
      { label: "EP12 weight", value: "98 kg" },
      { label: "EP12 max capacity", value: "46.08 kWh" },
      { label: "Depth of discharge", value: "90%" },
      { label: "Warranty", value: "10 years" },
    ],
    applications: ["Storing midday solar for the evening", "Backup with the FoxESS Hybrid Inverter", "Outdoor or garage installs"],
    faq: [
      {
        q: "EP6 or EP12?",
        a: "Same technology. EP12 holds more per unit, EP6 is smaller and lighter (51 kg against 98 kg). We size it from your bill.",
      },
      {
        q: "Can I add more batteries later?",
        a: "Yes, more units connect in parallel up to the maximum capacity of each model.",
      },
    ],
  },
  {
    id: "sigenstor-neo",
    category: "batteries",
    brand: "Sigenergy",
    name: "SigenStor Neo",
    tagline: "Five systems in one cabinet: inverter, battery and backup, stacked neatly.",
    highlights: ["5-in-1 cabinet", "0 ms switch to backup", "4 MPPTs for complex roofs", "Mix old and new modules"],
    images: [{ src: "/products/sigenstor-neo.png", alt: "SigenStor Neo stacked battery cabinet" }],
    overview:
      "SigenStor Neo puts the energy manager, PV inverter, battery converter, battery pack and backup module into one compact stack. Add battery modules any time: the built-in optimiser lets old and new packs run side by side.",
    features: [
      "EMS, PV inverter, battery PCS, battery and backup in one unit",
      "Stackable modules with quick connectors",
      "Backup port and smart port for the whole home",
      "Large-format cells with continuous monitoring and fire prevention",
    ],
    benefits: [
      "One tidy cabinet instead of several boxes on the wall",
      "Appliances do not notice when the grid goes down",
      "Grow storage without swapping out older modules",
      "Works with your EV charger, a generator or another brand's inverter",
    ],
    specs: [
      { label: "Integration", value: "5-in-1" },
      { label: "Backup switchover", value: "0 ms load-side disruption" },
      { label: "MPPTs", value: "4" },
      { label: "Protection", value: "IP66" },
      { label: "Expansion", value: "Modular, old and new packs mixed" },
      { label: "Warranty", value: "10 years" },
    ],
    applications: ["Whole-home backup", "Charging an EV from solar", "Adding storage to an existing solar system"],
    faq: [
      {
        q: "I already have solar with another inverter. Does it work?",
        a: "Yes. SigenStor Neo is compatible with third-party inverters, so it can be retrofitted.",
      },
      {
        q: "What happens during a blackout?",
        a: "Loads on the backup port switch over with 0 ms disruption, so the lights and fridge stay on.",
      },
    ],
  },
];
