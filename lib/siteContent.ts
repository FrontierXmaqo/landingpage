import { MAX_TEXT, ValidationError, oneOf, text } from "@/lib/validate";
import type { Category, Product } from "@/app/[lang]/(main)/products-and-services/products";
import type { Post, TopicKey } from "@/app/[lang]/(main)/blog/posts";

/**
 * Shape and validation for the `site_content` CMS sections (Products &
 * Services, Blog, Contact Us). Each section is one JSON document per status.
 *
 * Plain module on purpose: the admin editors run CLEAN in the browser before
 * saving (so they know exactly what the server will store), the server
 * actions run it again as the trust boundary, and the public fetcher runs it
 * on read so a malformed row falls back instead of breaking a page.
 */

export const SITE_SECTIONS = ["products", "services", "blog", "contact"] as const;
export type SiteSection = (typeof SITE_SECTIONS)[number];

export type Service = { title: string; body: string };
export type Blog = Record<TopicKey, Post[]>;
export type Contact = { address: string; mapsHref: string; office: string; officeTel: string; email: string };
export type SiteContent = { products: Product[]; services: Service[]; blog: Blog; contact: Contact };

export const CATEGORIES = ["panels", "inverters", "batteries"] as const satisfies readonly Category[];
export const TOPICS = ["schemes", "tariffs", "industry", "archive"] as const satisfies readonly TopicKey[];

/** Hosts next/image is allowed to load from (next.config.ts remotePatterns). */
const IMAGE_PREFIXES = [
  "https://yhpsidiipdassknsggcz.supabase.co/storage/v1/object/public/",
  "https://images.leadconnectorhq.com/",
  "https://assets.cdn.filesafe.space/",
];

const arr = (v: unknown, max: number): unknown[] => (Array.isArray(v) ? v.slice(0, max) : []);
const obj = (v: unknown) => (v && typeof v === "object" ? (v as Record<string, unknown>) : {});
const list = (v: unknown, max = 12, len = 300) => arr(v, max).map((x) => text(x, { max: len })).filter(Boolean);

function link(v: unknown, field: string) {
  const s = text(v, { max: 500 });
  if (s && !/^https?:\/\/\S+$/.test(s)) throw new ValidationError(`${field} must be a full link starting with https://`);
  return s;
}

function imageSrc(v: unknown) {
  const s = text(v, { max: 500 });
  if (!s || (s.startsWith("/") && !s.startsWith("//")) || IMAGE_PREFIXES.some((p) => s.startsWith(p))) return s;
  throw new ValidationError("Images must be uploaded here or be a /path on this site.");
}

function cleanProduct(v: unknown): Product {
  const p = obj(v);
  const name = text(p.name, { max: 120, required: true, field: "Product name" });
  return {
    id: text(p.id, { max: 80, required: true, field: "Product id" }).toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
    category: oneOf(p.category, CATEGORIES, "Category"),
    brand: text(p.brand, { max: 60 }),
    name,
    tagline: text(p.tagline, { max: 200 }),
    highlights: list(p.highlights, 4, 80),
    images: arr(p.images, 8)
      .map((i) => ({ src: imageSrc(obj(i).src), alt: text(obj(i).alt, { max: 200 }) }))
      .filter((i) => i.src),
    overview: text(p.overview, { max: MAX_TEXT }),
    features: list(p.features),
    benefits: list(p.benefits),
    specs: arr(p.specs, 30)
      .map((s) => ({ label: text(obj(s).label, { max: 80 }), value: text(obj(s).value, { max: 200 }) }))
      .filter((s) => s.label && s.value),
    applications: list(p.applications),
    faq: arr(p.faq, 12)
      .map((f) => ({ q: text(obj(f).q, { max: 300 }), a: text(obj(f).a, { max: 1200 }) }))
      .filter((f) => f.q && f.a),
  };
}

function cleanPost(v: unknown): Post {
  const p = obj(v);
  const href = link(p.href, "Article link");
  if (!href) throw new ValidationError("Article link is required.");
  return {
    title: text(p.title, { max: 200, required: true, field: "Article title" }),
    summary: text(p.summary, { max: 300 }),
    href,
  };
}

export const CLEAN: { [S in SiteSection]: (v: unknown) => SiteContent[S] } = {
  products: (v) => {
    const out = arr(v, 60).map(cleanProduct);
    const dup = out.find((p, i) => out.findIndex((q) => q.id === p.id) !== i);
    if (dup) throw new ValidationError(`Two products share the id "${dup.id}".`);
    return out;
  },
  services: (v) =>
    arr(v, 12).map((s) => ({
      title: text(obj(s).title, { max: 80, required: true, field: "Service title" }),
      body: text(obj(s).body, { max: 400 }),
    })),
  blog: (v) => Object.fromEntries(TOPICS.map((t) => [t, arr(obj(v)[t], 100).map(cleanPost)])) as Blog,
  contact: (v) => {
    const c = obj(v);
    const officeTel = text(c.officeTel, { max: 20, required: true, field: "Dial as" }).replace(/[\s-]/g, "");
    if (!/^\+?\d{6,15}$/.test(officeTel)) throw new ValidationError("Dial as must be digits only, e.g. +60380691706.");
    const email = text(c.email, { max: 120, required: true, field: "Email" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ValidationError("Email doesn't look like an email address.");
    return {
      address: text(c.address, { max: 300, required: true, field: "Office address" }),
      mapsHref: link(c.mapsHref, "Google Maps link"),
      office: text(c.office, { max: 40, required: true, field: "Office phone" }),
      officeTel,
      email,
    };
  },
};

/** The link-ready shape pages use (same as CONTACT in lib/content.ts). */
export function contactLinks(c: Contact) {
  return {
    address: c.address,
    mapsHref: c.mapsHref,
    office: c.office,
    officeHref: `tel:${c.officeTel}`,
    email: c.email,
    emailHref: `mailto:${c.email}`,
  };
}
export type ContactLinks = ReturnType<typeof contactLinks>;
