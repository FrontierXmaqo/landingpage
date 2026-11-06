/**
 * Where a lead came from, as one label for Lark's Lead Source column and respond.io's
 * "Source of Leads", from the visit's first-touch attribution (lib/attribution). UTM tags and
 * Google click ids win over the referrer, because app clicks often send no referrer at all.
 * A Meta click (fbclid) with no UTM tag can't say Instagram vs Facebook, so it stays "" —
 * Meta ads should carry `utm_source={{site_source_name}}` in their URL parameters.
 * "" = unknown (direct, other websites, other campaigns).
 */
export type LeadSource = "Instagram" | "Facebook" | "Threads" | "Google" | "Referral" | "";

/** The platform named by a utm_source or a referrer host, or "". */
function platform(s: string): LeadSource {
  if (/threads/.test(s)) return "Threads";
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

/** The visit's channel; submitLead swaps in "Referral" when a salesperson was picked. */
export function leadSource(a: { gclid: string; utmSource: string; referrer: string }): LeadSource {
  if (a.gclid) return "Google";
  const utm = a.utmSource.toLowerCase();
  return utm ? platform(utm) : platform(host(a.referrer));
}

/** The three values atap_leads / ci_leads.lead_source already hold (admin Enquiries, analytics). */
export function leadSourceGroup(channel: LeadSource, fbclid: string): "google" | "social" | "direct" {
  if (channel === "Google") return "google";
  if (channel || fbclid) return "social";
  return "direct";
}
