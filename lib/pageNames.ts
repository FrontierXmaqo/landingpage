import { LOCALES } from "@/lib/i18n";

/** Path segment -> the label shown on the Performance Analytics dashboard. */
const PAGE_LABELS: Record<string, string> = {
  "": "Home",
  about: "About",
  atap: "ATAP",
  bess: "BESS",
  "commercial-and-industrial": "Commercial & Industrial",
  ev: "EV",
  "thank-you": "Thank you",
};

/** Pages that embed a lead form under #assessment — the ones form drop-off applies to. */
export const PAGES_WITH_FORM = new Set(["ATAP", "BESS", "Commercial & Industrial", "EV"]);

/** "/en/atap" and "/ms/atap" both resolve to "ATAP" so the dashboard reports one row per page, not one per locale. */
export function pageNameFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const withoutLocale = (LOCALES as readonly string[]).includes(segments[0]) ? segments.slice(1) : segments;
  const key = withoutLocale[0] ?? "";
  return PAGE_LABELS[key] ?? key;
}
