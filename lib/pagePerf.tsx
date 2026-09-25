"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LOCALES } from "@/lib/i18n";
import { getSessionId, sendBeacon } from "@/lib/track";
import { getExternalReferrer } from "@/lib/getExternalReferrer";
import { captureAttribution } from "@/lib/attribution";

/**
 * Which page a path belongs to, for the "each page's performance" breakdown —
 * strips the locale prefix so /en/atap, /ms/atap and /cn/atap all roll into
 * one "atap" row instead of three.
 */
function segmentFor(path: string): "residential" | "ci" | "ev" | "shared" {
  const rest = path.split("/").filter(Boolean).slice((LOCALES as readonly string[]).includes(path.split("/")[1]) ? 1 : 0);
  const page = rest[0] || "";
  if (page === "atap" || page === "bess") return "residential";
  if (page === "commercial-and-industrial") return "ci";
  if (page === "ev") return "ev";
  return "shared";
}

function deviceFor(): "desktop" | "tablet" | "mobile" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function referrerKindFor(): "google" | "social" | "direct" | "other" {
  const ref = getExternalReferrer();
  if (!ref) return "direct";
  const host = new URL(ref).hostname;
  if (host.includes("google")) return "google";
  if (/facebook|instagram|tiktok|linkedin|twitter|x\.com|youtube/.test(host)) return "social";
  return "other";
}

const SECTION_VISIBLE_THRESHOLD = 0.5;

/**
 * One instance, mounted once in each locale layout, covers every page under
 * it. usePathname() re-runs the effect on every navigation (App Router keeps
 * the layout mounted across route changes), so each page gets its own
 * view_id, its own scroll/dwell/form state, and flushes independently.
 */
export default function PagePerfTracker() {
  const pathname = usePathname();
  const startedNewSession = useRef<boolean | null>(null);

  useEffect(() => {
    // Runs on every page of the site (this tracker is mounted once per root
    // layout, re-fires on each navigation) — captures ad-campaign attribution
    // on whichever page the visitor actually lands on, not just pages that
    // happen to have a lead form.
    captureAttribution();

    if (startedNewSession.current === null) {
      startedNewSession.current = !sessionStorage.getItem("maqo_session_id");
    }
    const isNewSession = startedNewSession.current;
    startedNewSession.current = false; // only the very first page of the session counts

    const viewId = crypto.randomUUID();
    const loadedAt = performance.now();
    const segment = segmentFor(pathname);
    const device = deviceFor();
    const referrerKind = referrerKindFor();
    const utmSource = new URLSearchParams(window.location.search).get("utm_source");

    let maxScroll = 0;
    let scrollScheduled = false;
    function measureScroll() {
      const doc = document.documentElement;
      const pct = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;
      maxScroll = Math.max(maxScroll, Math.min(100, Math.round(pct)));
      scrollScheduled = false;
    }
    function onScroll() {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(measureScroll);
    }
    measureScroll(); // a short page can start "100% scrolled" — that's correct, not a bug

    let visibleSince: number | null = document.visibilityState === "visible" ? performance.now() : null;
    let activeMs = 0;

    const sectionDwell = new Map<string, number>();
    const sectionStarts = new Map<string, number>();
    function pauseSection(id: string) {
      const start = sectionStarts.get(id);
      if (start == null) return;
      sectionDwell.set(id, (sectionDwell.get(id) ?? 0) + (performance.now() - start));
      sectionStarts.delete(id);
    }
    function resumeSection(id: string) {
      if (document.visibilityState !== "visible" || sectionStarts.has(id)) return;
      sectionStarts.set(id, performance.now());
    }
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!id) continue;
          if (entry.isIntersecting) resumeSection(id);
          else pauseSection(id);
        }
      },
      { threshold: SECTION_VISIBLE_THRESHOLD }
    );
    document.querySelectorAll("section[id]").forEach((el) => sectionObserver.observe(el));

    function onVisibilityChange() {
      const now = performance.now();
      if (document.visibilityState === "hidden") {
        if (visibleSince != null) activeMs += now - visibleSince;
        visibleSince = null;
        sectionStarts.forEach((_, id) => pauseSection(id));
      } else {
        visibleSince = now;
        document
          .querySelectorAll("section[id]")
          .forEach((el) => (isElementVisible(el) ? resumeSection(el.id) : undefined));
      }
      if (document.visibilityState === "hidden") flush();
    }
    function isElementVisible(el: Element) {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    }

    let formStarted = false;
    let formLastField: string | null = null;
    const ASSESSMENT_SELECTOR = "input[name], select[name], textarea[name]";
    function onFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement | null;
      if (!target || !target.matches(ASSESSMENT_SELECTOR)) return;
      if (!target.closest("#assessment")) return;
      formStarted = true;
      formLastField = (target as HTMLInputElement).name;
    }

    // Re-sent on every hidden transition, not just once — the server upserts
    // by view_id, so a long visit that tabs away and back keeps updating the
    // same row instead of losing everything after the first flush.
    function flush() {
      const now = performance.now();
      const finalActiveMs = activeMs + (visibleSince != null ? now - visibleSince : 0);
      sectionStarts.forEach((_, id) => pauseSection(id));

      sendBeacon("/api/track-perf", {
        view_id: viewId,
        session_id: getSessionId(),
        path: pathname,
        segment,
        device,
        referrer_kind: referrerKind,
        utm_source: utmSource,
        is_new_session: isNewSession,
        scroll_depth: maxScroll,
        active_ms: Math.round(finalActiveMs),
        total_ms: Math.round(now - loadedAt),
        section_dwell: Object.fromEntries([...sectionDwell.entries()].map(([id, ms]) => [id, Math.round(ms)])),
        form_started: formStarted,
        form_last_field: formLastField,
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("focusin", onFocusIn);
    window.addEventListener("pagehide", flush);

    return () => {
      flush();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("pagehide", flush);
      sectionObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
