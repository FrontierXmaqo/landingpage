import { startOfMonthMYISO } from "@/lib/datetime";
import { isSegment, type Segment } from "@/lib/segments";

/**
 * Filter state for the analytics page, carried in the URL rather than in
 * component state: the page is a server component that aggregates in Postgres,
 * so a filter has to survive the round trip — and a useful view stays
 * shareable, which is the whole point of sending someone a link to it.
 */

export const RANGES = [
  { id: "7d", label: "7 days", days: 7 },
  { id: "30d", label: "30 days", days: 30 },
  { id: "90d", label: "90 days", days: 90 },
  { id: "mtd", label: "This month", days: 0 },
] as const;

export type RangeId = (typeof RANGES)[number]["id"];

export const DEVICES = [
  { id: "all", label: "All" },
  { id: "desktop", label: "Desktop" },
  { id: "tablet", label: "Tablet" },
  { id: "mobile", label: "Mobile" },
] as const;

export type DeviceId = (typeof DEVICES)[number]["id"];

export type Filters = {
  segment: Segment | "all";
  range: RangeId;
  device: DeviceId;
  path: string | null;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/**
 * `allowed` is the caller's role scope. A segment outside it falls back to
 * "all", which the page then reads as "everything this role may see" — so a
 * hand-edited URL widens nothing.
 */
export function parseFilters(params: RawSearchParams, allowed: Segment[]): Filters {
  const segment = first(params.segment);
  const range = first(params.range);
  const device = first(params.device);
  const path = first(params.path);

  return {
    segment: isSegment(segment) && allowed.includes(segment) ? segment : "all",
    range: RANGES.some((r) => r.id === range) ? (range as RangeId) : "30d",
    device: DEVICES.some((d) => d.id === device) ? (device as DeviceId) : "all",
    // Paths come from the page's own list of published routes, but this is a
    // URL parameter, so bound it before it reaches a query.
    path: path && path.startsWith("/") && path.length <= 300 ? path : null,
  };
}

/** Start of the selected window, as a UTC ISO string for Supabase. */
export function sinceISO(range: RangeId) {
  if (range === "mtd") return startOfMonthMYISO();
  const days = RANGES.find((r) => r.id === range)?.days ?? 30;
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/** The same filters with one key changed — for building a control's links. */
export function withFilter(current: Filters, patch: Partial<Filters>) {
  const next = { ...current, ...patch };
  const q = new URLSearchParams();
  if (next.segment !== "all") q.set("segment", next.segment);
  if (next.range !== "30d") q.set("range", next.range);
  if (next.device !== "all") q.set("device", next.device);
  if (next.path) q.set("path", next.path);
  const s = q.toString();
  return s ? `/admin/analytics?${s}` : "/admin/analytics";
}

export function rangeLabel(range: RangeId) {
  return RANGES.find((r) => r.id === range)?.label ?? "30 days";
}
