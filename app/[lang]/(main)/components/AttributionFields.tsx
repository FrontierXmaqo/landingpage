"use client";

import { useEffect, useRef } from "react";
import { resolveLeadAttribution, type LeadAttributionFields } from "@/lib/attribution";

/** Hidden input name -> the attribution value it carries, in form order. */
const FIELDS: [name: string, key: keyof LeadAttributionFields | "landingPageSource"][] = [
  ["campaign_id", "campaignId"],
  ["gclid", "gclid"],
  ["fbclid", "fbclid"],
  ["landing_referrer", "referrer"],
  ["landing_page_source", "landingPageSource"],
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_term", "utmTerm"],
  ["utm_content", "utmContent"],
];

/**
 * The hidden attribution inputs every lead form posts (main site, C&I, EV).
 *
 * Reads the visit's first-touch attribution (persisted by lib/attribution
 * since whichever page the visitor actually landed on) rather than this
 * page's own URL, so campaign data survives even when the visitor browsed
 * elsewhere before reaching this form.
 *
 * `landingPath` is appended to the site origin for landing_page_source. It is
 * fixed per form, never derived from location.pathname, because the same page
 * can be reached at more than one URL (e.g. /ev and /?site=ev via proxy.ts).
 */
export default function AttributionFields({ landingPath = "" }: { landingPath?: string }) {
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    const values = { ...resolveLeadAttribution(), landingPageSource: window.location.origin + landingPath };
    for (const [name, key] of FIELDS) {
      const input = inputs.current[name];
      if (input) input.value = values[key];
    }
  }, [landingPath]);

  return (
    <>
      {FIELDS.map(([name]) => (
        <input
          key={name}
          type="hidden"
          name={name}
          ref={(el) => {
            inputs.current[name] = el;
          }}
        />
      ))}
    </>
  );
}
