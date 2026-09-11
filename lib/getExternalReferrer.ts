// Mirrors how the GHL-hosted funnel reports "Source of Leads": the exact
// referring site's origin (e.g. "https://google.com", "https://facebook.com"),
// blank for direct traffic — never our own domain or a Vercel preview/dashboard
// referrer, since those aren't real traffic sources.
const EXCLUDED_REFERRER_HOST_SUFFIXES = ["vercel.app", "vercel.com"];

export function getExternalReferrer(): string {
  const ref = document.referrer;
  if (!ref) return "";

  let refUrl: URL;
  try {
    refUrl = new URL(ref);
  } catch {
    return "";
  }

  if (refUrl.hostname === window.location.hostname) return "";
  if (
    EXCLUDED_REFERRER_HOST_SUFFIXES.some(
      (suffix) => refUrl.hostname === suffix || refUrl.hostname.endsWith(`.${suffix}`)
    )
  ) {
    return "";
  }

  return refUrl.origin;
}
