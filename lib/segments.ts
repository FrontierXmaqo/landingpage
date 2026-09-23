import { hasLocale } from "@/lib/i18n/config";

/**
 * The three business lines the CMS reports on.
 *
 * Single source of truth for labels and colours so Analytics, Enquiries, FAQ
 * and the Lead Form editor can't drift into calling the same thing three
 * different names — which is exactly what had happened ("Main" in the Lead
 * Form editor, "Residential" in the FAQ editor, "Residential & EV" in
 * Enquiries).
 *
 * The dot colours are each page's own identity on the live site, already used
 * by the FAQ and Lead Form editors' jump navs.
 */
export type Segment = "residential" | "ci" | "ev";

/** Pages that serve every line — the homepage and About — belong to no one. */
export type PageSegment = Segment | "shared";

export const SEGMENTS: { id: Segment; label: string; dot: string }[] = [
  { id: "residential", label: "Residential", dot: "#F97000" },
  { id: "ci", label: "C&I", dot: "#15304F" },
  { id: "ev", label: "EV", dot: "#1E9E52" },
];

export const SEGMENT_LABEL: Record<PageSegment, string> = {
  residential: "Residential",
  ci: "C&I",
  ev: "EV",
  shared: "Shared",
};

export const SEGMENT_DOT: Record<PageSegment, string> = {
  residential: "#F97000",
  ci: "#15304F",
  ev: "#1E9E52",
  shared: "#848B85",
};

export function isSegment(value: unknown): value is Segment {
  return value === "residential" || value === "ci" || value === "ev";
}

/**
 * Which line a public URL belongs to. BESS sits with C&I: it targets the same
 * TNB medium-voltage customers the C&I team already owns.
 *
 * The locale prefix is stripped first, so /ms/atap and /atap both resolve.
 */
export function segmentForPath(pathname: string): PageSegment {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && hasLocale(parts[0])) parts.shift();
  const route = parts[0] ?? "";

  switch (route) {
    case "residential":
    case "atap":
      return "residential";
    case "commercial-and-industrial":
    case "bess":
      return "ci";
    case "ev":
      return "ev";
    default:
      // Homepage, /about, and anything not yet mapped.
      return "shared";
  }
}

/**
 * The segment a lead belongs to. C&I needs no stored column — ci_leads is the
 * C&I segment. Residential and EV share atap_leads, so they carry one.
 */
export function leadSegment(row: { segment?: string | null }, table: "atap" | "ci"): Segment | "unknown" {
  if (table === "ci") return "ci";
  return row.segment === "residential" || row.segment === "ev" ? row.segment : "unknown";
}
