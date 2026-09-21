"use client";

import { segmentForPath } from "@/lib/segments";

/* -------------------------------------------------------------------------
   First-party visitor analytics.

   Everything here is best-effort and must never throw or block: a tracking
   bug should cost a data point, never a lead. No cookies, no keystrokes, no
   form values, no element text — only counts, depths and durations. The two
   ids below live in the browser's own storage and are random; nothing about
   them identifies a person.
   ------------------------------------------------------------------------- */

const SESSION_KEY = "maqo_session_id";
const VISITOR_KEY = "maqo_visitor_seen";
const NEW_VISITOR_KEY = "maqo_visitor_new";

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return String(Date.now()) + Math.random().toString(36).slice(2);
  }
}

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = newId();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return newId(); // storage blocked (private mode) — still fine for a fire-and-forget beacon.
  }
}

/**
 * Whether this session belongs to a first-time visitor. Detected from a flag
 * in local storage, not a cookie.
 *
 * The answer is cached for the session, because reading it consumes it: every
 * page view in one visit must agree, or the second view would report the
 * visitor as returning and the session's own history would contradict itself.
 */
function isNewVisitor() {
  try {
    const cached = sessionStorage.getItem(NEW_VISITOR_KEY);
    if (cached !== null) return cached === "1";
    const first = !localStorage.getItem(VISITOR_KEY);
    localStorage.setItem(VISITOR_KEY, "1");
    sessionStorage.setItem(NEW_VISITOR_KEY, first ? "1" : "0");
    return first;
  } catch {
    return true;
  }
}

function deviceClass(): "desktop" | "tablet" | "mobile" {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function referrerKind(): "google" | "social" | "direct" | "other" {
  const r = document.referrer;
  if (!r) return "direct";
  try {
    const host = new URL(r).hostname;
    if (host === window.location.hostname) return "direct";
    if (/google|bing|yahoo|duckduckgo/i.test(host)) return "google";
    if (/facebook|fb\.|instagram|tiktok|linkedin|twitter|x\.com|youtube|threads/i.test(host)) return "social";
    return "other";
  } catch {
    return "other";
  }
}

function post(path: string, payload: unknown) {
  try {
    const body = JSON.stringify(payload);
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.(path, blob)) return;
    void fetch(path, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    // best-effort only
  }
}

/* ---------------- existing conversion events, unchanged API ---------------- */

/** Fire-and-forget conversion event. Never blocks or throws. */
export function trackEvent(eventType: "pageview" | "calculator_start" | "calculator_complete") {
  try {
    post("/api/track", {
      event_type: eventType,
      session_id: getSessionId(),
      path: window.location.pathname,
      utm_source: new URLSearchParams(window.location.search).get("utm_source"),
    });
  } catch {
    // best-effort only
  }
}

/** Fires an event once per session (sessionStorage-deduped). */
export function trackOnce(eventType: "pageview" | "calculator_start") {
  try {
    const key = `maqo_tracked_${eventType}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // fall through and track anyway if storage is blocked
  }
  trackEvent(eventType);
}

/* ---------------- page-view behaviour ---------------- */

const INTERACTION_IDLE_MS = 30_000;
const RAGE_WINDOW_MS = 1_000;
const RAGE_RADIUS_PX = 40;
const RAGE_MIN_CLICKS = 3;
const DEAD_CLICK_WAIT_MS = 600;
const QUICK_BACK_MS = 5_000;
const EXCESS_SCROLL_FACTOR = 4;

const INTERACTIVE = "a,button,input,select,textarea,label,summary,details,[role=button],[role=link],[role=tab],[contenteditable]";

/**
 * Starts recording one page view. Returns a teardown function.
 *
 * The same view_id is beaconed more than once (on tab-hide and again at
 * unload); the API upserts on it, so a view is one row that fills in rather
 * than a stream of events to reassemble later.
 */
export function trackPageView() {
  if (typeof window === "undefined") return () => {};

  try {
    const viewId = newId();
    const sessionId = getSessionId();
    const path = window.location.pathname;
    const startedAt = Date.now();

    let scrollDepth = 0;
    let activeMs = 0;
    let rageClicks = 0;
    let deadClicks = 0;
    let scrolledPx = 0;
    let excessScroll = false;
    let sentFinal = false;

    // Read before the first beacon, so the flag it sets doesn't make this same
    // view look like a return visit.
    const isNew = isNewVisitor();

    let lastTick = Date.now();
    let lastInteraction = Date.now();
    let lastScrollY = window.scrollY;
    let recentClicks: { x: number; y: number; t: number }[] = [];

    const measureDepth = () => {
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );
      // A page shorter than the viewport is fully seen by definition.
      const pct = docHeight <= 0 ? 100 : Math.round(((window.scrollY + window.innerHeight) / (docHeight + window.innerHeight)) * 100);
      if (pct > scrollDepth) scrollDepth = Math.min(100, Math.max(0, pct));
    };

    /* Active time: only while the tab is visible AND the visitor has done
       something in the last 30s, so a page left open overnight doesn't read
       as engagement. */
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTick;
      lastTick = now;
      if (document.visibilityState === "visible" && now - lastInteraction < INTERACTION_IDLE_MS) {
        activeMs += delta;
      }
    };
    const timer = window.setInterval(tick, 1_000);

    const onScroll = () => {
      lastInteraction = Date.now();
      scrolledPx += Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      measureDepth();
      if (!excessScroll) {
        const h = document.documentElement.scrollHeight || 1;
        if (scrolledPx > h * EXCESS_SCROLL_FACTOR) excessScroll = true;
      }
    };

    const onPointer = () => {
      lastInteraction = Date.now();
    };

    const onClick = (e: MouseEvent) => {
      lastInteraction = Date.now();
      const now = Date.now();

      // Rage: several clicks in one spot in quick succession.
      recentClicks = recentClicks.filter((c) => now - c.t < RAGE_WINDOW_MS);
      recentClicks.push({ x: e.clientX, y: e.clientY, t: now });
      const cluster = recentClicks.filter(
        (c) => Math.hypot(c.x - e.clientX, c.y - e.clientY) < RAGE_RADIUS_PX,
      );
      if (cluster.length >= RAGE_MIN_CLICKS) {
        rageClicks += 1;
        recentClicks = []; // one burst counts once
      }

      // Dead: a click on something inert that changes nothing on the page.
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;
      if (target.closest(INTERACTIVE)) return;

      let mutated = false;
      let observer: MutationObserver | null = null;
      try {
        observer = new MutationObserver(() => {
          mutated = true;
          observer?.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
      } catch {
        return;
      }
      window.setTimeout(() => {
        observer?.disconnect();
        if (!mutated) deadClicks += 1;
      }, DEAD_CLICK_WAIT_MS);
    };

    const send = (final: boolean) => {
      tick();
      measureDepth();
      const totalMs = Date.now() - startedAt;
      // Only a genuine bounce counts as a quick back, not a tab switch.
      const quickBack = final && totalMs < QUICK_BACK_MS && scrollDepth < 25;

      post("/api/track/view", {
        view_id: viewId,
        session_id: sessionId,
        path,
        segment: segmentForPath(path),
        device: deviceClass(),
        referrer_kind: referrerKind(),
        utm_source: new URLSearchParams(window.location.search).get("utm_source"),
        is_new_session: isNew,
        scroll_depth: scrollDepth,
        active_ms: Math.round(activeMs),
        total_ms: totalMs,
        rage_clicks: rageClicks,
        dead_clicks: deadClicks,
        excess_scroll: excessScroll,
        quick_back: quickBack,
      });
      if (final) sentFinal = true;
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") send(false);
    };
    const onPageHide = () => send(true);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("keydown", onPointer, { passive: true });
    window.addEventListener("click", onClick, { passive: true, capture: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);

    measureDepth();

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onPointer);
      window.removeEventListener("click", onClick, { capture: true } as EventListenerOptions);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      /* A client-side route change unmounts without firing pagehide, so the
         view still has to be closed here. The floor discards a view that
         never really happened — React's development double-mount, or a
         remount within the same frame — which would otherwise land as a row
         with no scroll and no time and drag every average down. */
      if (!sentFinal && Date.now() - startedAt > 300) send(true);
    };
  } catch {
    return () => {};
  }
}
