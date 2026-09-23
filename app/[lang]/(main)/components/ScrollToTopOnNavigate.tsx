"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Sends the visitor to the top of the page when they follow a link to a
 * different route.
 *
 * App Router's `<Link>` deliberately *keeps* the scroll position: per the
 * Next docs, "scroll position will stay the same as long as the Page is
 * visible in the viewport", and it only jumps to the top when the page
 * element is out of view. Every page here is one long `<main>` that spans the
 * whole scroll range, so it is always "visible" and the position is always
 * kept. `scroll={true}` is already the default and does not change this, so
 * the reset has to be explicit.
 *
 * Two cases are deliberately left alone:
 *
 * - A link carrying a hash (`/residential#assessment`) means "take me to that
 *   element", so forcing the top would undo exactly what was asked for.
 * - Back and forward should restore where the visitor actually was. A
 *   `popstate` fires before React re-renders with the new pathname, so the
 *   flag is already set by the time the effect below runs.
 */
export default function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const cameFromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      cameFromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (cameFromHistory.current) {
      cameFromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
