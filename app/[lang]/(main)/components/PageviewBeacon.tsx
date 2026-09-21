"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackOnce, trackPageView } from "@/lib/track";

/**
 * Two separate jobs, both first-party and both fire-and-forget.
 *
 * `trackOnce("pageview")` is the per-session conversion counter the funnel
 * charts have always used. `trackPageView` records how this one page view
 * actually went — scroll depth, active time, rage and dead clicks — and
 * beacons a summary when the tab is hidden or the page unloads.
 *
 * The recorder starts immediately rather than on idle: it has to be listening
 * before the visitor scrolls, or the first and most telling seconds are lost.
 * Its listeners are all passive, so they don't compete with hydration.
 *
 * Keyed on the pathname so a client-side navigation closes one view and opens
 * the next, instead of attributing the whole visit to the landing page.
 */
export default function PageviewBeacon() {
  const pathname = usePathname();

  useEffect(() => trackPageView(), [pathname]);

  useEffect(() => {
    const fire = () => trackOnce("pageview");
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(fire, { timeout: 3000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(fire, 1000);
    return () => clearTimeout(id);
  }, []);

  return null;
}
