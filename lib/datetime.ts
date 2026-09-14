// The admin CMS is used from Malaysia, but the site runs on Vercel where the
// server clock is UTC — so every date must be formatted against an explicit
// timezone rather than the runtime's. Malaysia is a fixed UTC+8 with no DST,
// which is what makes the arithmetic in startOfMonthMYISO safe.
export const MY_TIME_ZONE = "Asia/Kuala_Lumpur";
const MY_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;

/** e.g. "14 Sep 2026, 3:47 pm" — Malaysia time, wherever this runs. */
export function formatMYDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: MY_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

/** e.g. "14 Sep 2026" — Malaysia time, wherever this runs. */
export function formatMYDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: MY_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Midnight on the 1st of the current Malaysian month, as a UTC ISO string for
 * querying Supabase. On a UTC server, building this from local getMonth() would
 * roll the month over 8 hours late, so the first 8 hours of each new month
 * would still be counted against the previous one.
 */
export function startOfMonthMYISO() {
  const nowInMY = new Date(Date.now() + MY_UTC_OFFSET_MS);
  const monthStartMY = Date.UTC(nowInMY.getUTCFullYear(), nowInMY.getUTCMonth(), 1);
  return new Date(monthStartMY - MY_UTC_OFFSET_MS).toISOString();
}
