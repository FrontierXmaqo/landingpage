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
