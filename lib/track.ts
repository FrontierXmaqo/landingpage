"use client";

/** Shared by every session-scoped tracker on the site (pageview events, page performance). */
export function getSessionId() {
  try {
    let id = sessionStorage.getItem("maqo_session_id");
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem("maqo_session_id", id);
    }
    return id;
  } catch {
    return crypto.randomUUID(); // storage blocked (private mode) — still fine for a single fire-and-forget beacon.
  }
}

/** Fire-and-forget POST that survives page unload. Never blocks or throws. */
export function sendBeacon(url: string, payload: unknown) {
  try {
    const body = JSON.stringify(payload);
    const sent = navigator.sendBeacon?.(url, new Blob([body], { type: "application/json" }));
    if (!sent) fetch(url, { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    // best-effort only
  }
}

/** Fire-and-forget first-party analytics event for the Performance Analytics dashboard. Never blocks or throws. */
export function trackEvent(eventType: "pageview" | "calculator_start" | "calculator_complete") {
  sendBeacon("/api/track", {
    event_type: eventType,
    session_id: getSessionId(),
    path: window.location.pathname,
    utm_source: new URLSearchParams(window.location.search).get("utm_source"),
  });
}

/** Fires an event once per session (sessionStorage-deduped) — for pageview / calculator_start. */
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
