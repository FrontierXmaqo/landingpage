"use client";

/* -------------------------------------------------------------------------
   First-party visitor analytics.

   Everything here is best-effort and must never throw or block: a tracking
   bug should cost a data point, never a lead. No cookies, no keystrokes, no
   form values, no element text — only counts, depths and durations. The
   session id below lives in the browser's own storage and is random; nothing
   about it identifies a person.
   ------------------------------------------------------------------------- */

const SESSION_KEY = "maqo_session_id";

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return String(Date.now()) + Math.random().toString(36).slice(2);
  }
}

/** Shared by every session-scoped tracker on the site (pageview events, page performance). */
export function getSessionId() {
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

/** Fire-and-forget POST that survives page unload. Never blocks or throws. */
export function sendBeacon(url: string, payload: unknown) {
  try {
    const body = JSON.stringify(payload);
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.(url, blob)) return;
    void fetch(url, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    // best-effort only
  }
}

/* ---------------- conversion events ---------------- */

/** Fire-and-forget conversion event. Never blocks or throws. */
export function trackEvent(eventType: "pageview" | "calculator_start" | "calculator_complete") {
  sendBeacon("/api/track", {
    event_type: eventType,
    session_id: getSessionId(),
    path: window.location.pathname,
    utm_source: new URLSearchParams(window.location.search).get("utm_source"),
  });
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
