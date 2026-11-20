/**
 * Where a lead came from, as one label for Lark's "Source of Leads" and respond.io's
 * "Source of Leads", from the visit's first-touch attribution (lib/attribution). The labels are
 * Lark's own options, letter for letter, so its "All Source of Lead" picks them up.
 * A Google click id or a UTM tag means an ad; a social referrer alone means organic. A Meta click
 * (fbclid) with no UTM tag can't say Instagram vs Facebook, so it is "Website Direct Traffic" —
 * Meta ads should carry `utm_source={{site_source_name}}` in their URL parameters.
 */
export type LeadSource =
  | "Google Ads"
  | "Facebook Ads"
  | "IG Ads"
  | "Threads Ads"
  | "Facebook Organic"
  | "Instagram Organic"
  | "Social Media"
  | "Sales Agent Referral"
  | "Website Direct Traffic";

type Platform = "Instagram" | "Facebook" | "Threads" | "Google" | "";

const ADS: Record<Platform, LeadSource> = {
  Instagram: "IG Ads",
  Facebook: "Facebook Ads",
  Threads: "Threads Ads",
  Google: "Google Ads",
  "": "Website Direct Traffic",
};
// Lark has no Threads or Google organic option.
const ORGANIC: Record<Platform, LeadSource> = {
  Instagram: "Instagram Organic",
  Facebook: "Facebook Organic",
  Threads: "Social Media",
  Google: "Website Direct Traffic",
  "": "Website Direct Traffic",
};

/** The platform named by a utm_source or a referrer host, or "". */
function platform(s: string): Platform {
  if (/threads|^th$/.test(s)) return "Threads";
  if (/instagram|^ig$/.test(s)) return "Instagram";
  if (/facebook|^fb$|(^|\.)fb\.com$/.test(s)) return "Facebook";
  if (/google/.test(s)) return "Google";
  return "";
}

function host(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

/** The visit's channel; submitLead swaps in "Sales Agent Referral" when a salesperson was picked. */
export function leadSource(a: { gclid: string; utmSource: string; referrer: string }): LeadSource {
  if (a.gclid) return "Google Ads";
  const utm = a.utmSource.toLowerCase();
  // Meta's {{site_source_name}} sends fb / ig / th, sometimes with a suffix ("fb-WebsiteKeyInfo").
  return utm ? ADS[platform(utm.replace(/^(fb|ig|th)(?![a-z0-9]).*/, "$1"))] : ORGANIC[platform(host(a.referrer))];
}

/** The three values atap_leads / ci_leads.lead_source already hold (admin Enquiries, analytics). */
export function leadSourceGroup(channel: LeadSource, fbclid: string): "google" | "social" | "direct" {
  if (channel === "Google Ads") return "google";
  if (channel !== "Website Direct Traffic" || fbclid) return "social";
  return "direct";
}
