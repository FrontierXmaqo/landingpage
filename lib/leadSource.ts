/**
 * Where a lead came from, as one label the sales team can filter on in Lark, from the visit's
 * first-touch attribution (lib/attribution). Ad click ids and UTM tags win over the referrer,
 * because Facebook/Instagram app clicks and many phone clicks send no referrer at all.
 * fbclid is added to every Facebook/Instagram link click, paid or not, so without a Meta UTM
 * tag it reads "Meta (Facebook / Instagram)" rather than "Meta Ads".
 */
export type LeadSource =
  | "Google Ads"
  | "Meta Ads"
  | "Meta (Facebook / Instagram)"
  | "Google Search"
  | "Other website"
  | "Other campaign"
  | "Direct";

const META = /facebook|instagram|^fb$|^ig$|^meta$|fb\.com/;

export function leadSource(a: { gclid: string; fbclid: string; utmSource: string; utmMedium: string; referrer: string }): LeadSource {
  const utm = a.utmSource.toLowerCase();
  const paid = /cpc|ppc|paid|^ads?$/.test(a.utmMedium.toLowerCase());
  const ref = a.referrer.toLowerCase();
  if (a.gclid || (utm === "google" && paid)) return "Google Ads";
  if (META.test(utm)) return "Meta Ads";
  if (a.fbclid) return "Meta (Facebook / Instagram)";
  if (utm) return "Other campaign";
  if (/\bgoogle\./.test(ref)) return "Google Search";
  if (META.test(ref)) return "Meta (Facebook / Instagram)";
  if (ref) return "Other website";
  return "Direct";
}

/** The three values atap_leads / ci_leads.lead_source already hold (admin Enquiries, analytics). */
export function leadSourceGroup(source: LeadSource): "google" | "social" | "direct" {
  if (source.startsWith("Google")) return "google";
  if (source.startsWith("Meta")) return "social";
  return "direct";
}
