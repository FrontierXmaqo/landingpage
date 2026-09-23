"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires the lead conversion once per thank-you visit. GTM and the Meta Pixel
 * are already bootstrapped by the root layout (see layout.tsx) — this only
 * adds the conversion event on top of that, deduped per session so a page
 * refresh doesn't double-count the same lead.
 */
export default function ThankYouTracking({ id }: { id: string }) {
  useEffect(() => {
    const key = `maqo_lead_tracked_${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // storage blocked (private mode) — fire anyway rather than silently drop the conversion
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "generate_lead" });
    // New, stricter event: only ever fires from a proxy-verified thank-you
    // load. Kept alongside generate_lead so existing GTM triggers keep
    // working until they're switched over to this one.
    window.dataLayer.push({ event: "lead_confirmed" });
    // event_id lets a future Conversions API call dedupe against this
    // browser-side pixel fire for the same lead.
    window.fbq?.("track", "Lead", {}, { eventID: crypto.randomUUID() });
  }, [id]);

  return null;
}
