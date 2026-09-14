"use client";

function getSessionId() {
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

/** Fire-and-forget first-party analytics event for the Performance Analytics dashboard. Never blocks or throws. */
export function trackEvent(eventType: "pageview" | "calculator_start" | "calculator_complete") {
  try {
    const payload = JSON.stringify({
      event_type: eventType,
      session_id: getSessionId(),
      path: window.location.pathname,
      utm_source: new URLSearchParams(window.location.search).get("utm_source"),
    });
    const sent = navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }));
    if (!sent) fetch("/api/track", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true });
  } catch {
    // best-effort only
  }
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
