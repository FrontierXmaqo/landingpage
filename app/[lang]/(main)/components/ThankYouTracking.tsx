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
    window.fbq?.("track", "Lead");
  }, [id]);

  return null;
}
