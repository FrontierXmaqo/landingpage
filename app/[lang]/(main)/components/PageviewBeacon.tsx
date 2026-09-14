"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/track";

/** Fires one first-party pageview event per session, for the Performance Analytics dashboard. */
export default function PageviewBeacon() {
  useEffect(() => {
    trackOnce("pageview");
  }, []);
  return null;
}
