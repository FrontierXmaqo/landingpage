"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/track";

/**
 * Fires one first-party pageview event per session, for the Performance
 * Analytics dashboard. Held until the main thread is idle: the beacon is
 * fire-and-forget, so nothing is gained by competing with hydration for the
 * thread, and the sessionStorage reads it does are synchronous.
 */
export default function PageviewBeacon() {
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
