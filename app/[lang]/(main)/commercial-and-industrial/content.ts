/**
 * Structural data for the Commercial & Industrial landing page: the client
 * roster, trust stats, reference projects and credential tiles.
 *
 * These are the fallbacks the page renders when the CMS is empty or
 * unreachable. Only the trust stats are translated: the CMS stores one English
 * row per project. All other translated copy lives in copy.ts.
 */

import type { Locale } from "@/lib/i18n";

/**
 * Client roster supplied by marketing. Rendered as wordmarks, not images -
 * the repo carries no logo files for these brands. Drop PNGs into
 * /public/logos/clients and add a `logo` key here to switch to images.
 */
/** Fallback roster, used when the CMS table is empty or unreachable. Logos are
 *  CMS-only, the built-in list is names, which is what the tiles showed before. */
export const CLIENTS = [
  { name: "Spritzer" },
  { name: "DHL" },
  { name: "Scientex" },
  { name: "A&W" },
  { name: "Mazda" },
  { name: "Xpeng" },
  { name: "Press Metal" },
  { name: "Delloyd" },
  { name: "A&A Chesterfield" },
  { name: "Hengwood" },
  { name: "Sugihara Grand Industries" },
  { name: "Integrated Logistics Solutions" },
  { name: "Medic Point" },
  { name: "Marble Emporium" },
  { name: "Mega Fortris" },
  { name: "Darco" },
  { name: "Din Tai Fung" },
  { name: "Dynasynergy" },
  { name: "Tenaga Nasional" },
  { name: "KTH Paint" },
  { name: "PMB Technology" },
  { name: "Everlas" },
  { name: "EAN Labels" },
  { name: "iKYellow" },
  { name: "Pecca Group" },
  { name: "Sin Huat Hin Machinery" },
  { name: "Thamesa" },
  { name: "Bon Food" },
  { name: "3V" },
  { name: "Superdaya" },
  { name: "Universiti Teknologi MARA" },
  { name: "Bermaz Auto" },
  { name: "Water Engineering Technology" },
];

/** Fallback trust stats per language. The CMS copy is English only, so the
 *  Chinese and Malay pages always use these. */
export const TRUST_STATS: Record<Locale, { value: string; label: string }[]> = {
  en: [
    { value: "10+", label: "Years Experience" },
    { value: "100+", label: "Commercial Installs" },
    { value: "100%", label: "SEDA / TNB Approved" },
  ],
  cn: [
    { value: "10+", label: "年经验" },
    { value: "100+", label: "工商业安装项目" },
    { value: "100%", label: "SEDA / TNB 认可" },
  ],
  ms: [
    { value: "10+", label: "Tahun Pengalaman" },
    { value: "100+", label: "Pemasangan Komersial" },
    { value: "100%", label: "Diluluskan SEDA / TNB" },
  ],
};

export type Project = {
  /** Free text, see projectIcon() in icons.ts for how an unknown one renders. */
  tag: string;
  /** As published on the original page, "1,071 kWp", "10.25 MWp". Kept as a
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
   *  supplies a signed-off line per site, an empty field simply renders
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

// Hero tiles. Add `logo` (a path under /public) once the official marks are supplied.
export const CREDENTIALS: { mark: string; issuer: string; logo?: string }[] = [
  { mark: "ST Class A", issuer: "Suruhanjaya Tenaga" },
  { mark: "CIDB G7", issuer: "Highest contractor grade" },
  { mark: "SEDA", issuer: "Registered installer" },
  { mark: "ISO 9001:2015", issuer: "Quality managed" },
];
