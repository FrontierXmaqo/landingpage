"use client";

/* -------------------------------------------------------------------------
   Ad-campaign attribution, persisted across the whole visit.

   The problem: UTM params and click IDs only exist in the URL of the page an
   ad actually links to. The moment a visitor clicks through to another page —
   or otherwise reaches the lead form on a URL with no query string — that
   campaign data is gone. This captures it once, on the very first page of
   the visit, and keeps it available to every form on the site until the
   visitor submits or the attribution window (TTL) lapses.

   First touch wins: once a campaign is captured, later page loads within the
   TTL window never overwrite it, even if the visitor arrives through a
   different ad on a later visit — the first click is the one credited.

   Storage: localStorage holds the actual attribution data (it has to survive
   the visitor closing the tab and coming back later); sessionStorage mirrors
   it so it is still readable when a visitor's browser allows storage only
   for the current tab. A same-named cookie carries no data — it is purely
   the TTL: its absence is what tells us any stored attribution is stale and
   should be dropped, so we never hold onto it indefinitely.
   ------------------------------------------------------------------------- */

import { getExternalReferrer } from "./getExternalReferrer";

const STORAGE_KEY = "maqo_attribution";
const TTL_COOKIE = "maqo_attribution_ttl";
const TTL_DAYS = 30;

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const CLICK_ID_PARAMS = ["gclid", "fbclid"] as const;

export type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fbclid: string;
  referrer: string;
  captured_at: string;
};

function hasCookie(name: string) {
  return document.cookie.split("; ").some((c) => c === name || c.startsWith(`${name}=`));
}

function setCookie(name: string, value: string, days: number) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; Max-Age=${days * 86400}; Path=/; SameSite=Lax${secure}`;
}

function readStored(): Attribution | null {
  for (const store of [() => localStorage, () => sessionStorage]) {
    try {
      const raw = store().getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Attribution;
    } catch {
      // storage blocked or value corrupted — try the next one
    }
  }
  return null;
}

function writeStored(data: Attribution) {
  const raw = JSON.stringify(data);
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // ignore — sessionStorage below still carries it for this tab
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // ignore — best effort only
  }
}

function clearStored() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Call on every page load. Captures first-touch UTM/click-id params (and the
 * original external referrer) the first time any of them show up, then
 * leaves them alone for the rest of the TTL window. Best-effort and never
 * throws: a tracking bug should cost attribution data, never break the page.
 */
export function captureAttribution() {
  try {
    const ttlValid = hasCookie(TTL_COOKIE);
    const existing = readStored();

    if (existing && ttlValid) return; // first touch already captured and still within its window
    if (existing && !ttlValid) clearStored(); // window lapsed — drop the stale data for privacy

    const params = new URLSearchParams(window.location.search);
    const utmValues = Object.fromEntries(UTM_PARAMS.map((k) => [k, params.get(k) || ""])) as Record<
      (typeof UTM_PARAMS)[number],
      string
    >;
    const clickIds = Object.fromEntries(CLICK_ID_PARAMS.map((k) => [k, params.get(k) || ""])) as Record<
      (typeof CLICK_ID_PARAMS)[number],
      string
    >;
    const referrer = getExternalReferrer();
    const hasSignal = Object.values(utmValues).some(Boolean) || Object.values(clickIds).some(Boolean) || referrer;
    if (!hasSignal) return; // direct/organic visit with nothing new worth capturing

    const data: Attribution = {
      ...utmValues,
      ...clickIds,
      referrer,
      captured_at: new Date().toISOString(),
    };
    writeStored(data);
    setCookie(TTL_COOKIE, "1", TTL_DAYS);
  } catch {
    // best-effort only
  }
}

/** Reads the persisted first-touch attribution, if any is still stored. */
export function getAttribution(): Attribution | null {
  try {
    return readStored();
  } catch {
    return null;
  }
}

export type LeadAttributionFields = {
  campaignId: string;
  gclid: string;
  fbclid: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
};

/**
 * What a lead form's hidden attribution fields should be populated with at
 * submit time: the persisted first-touch attribution when one has been
 * captured, falling back to this page's own URL (covers the rare case where
 * this is the very first page of the visit and capture hasn't run yet).
 * `campaign_id` in the current URL, when present, always wins — a handful of
 * internal links pass it explicitly rather than as a UTM param.
 */
export function resolveLeadAttribution(): LeadAttributionFields {
  const stored = getAttribution();
  const params = new URLSearchParams(window.location.search);
  const live: Attribution = {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    gclid: params.get("gclid") || "",
    fbclid: params.get("fbclid") || "",
    referrer: getExternalReferrer(),
    captured_at: "",
  };
  const a = stored ?? live;

  return {
    campaignId: params.get("campaign_id") || a.utm_campaign || a.gclid || "",
    gclid: a.gclid,
    fbclid: a.fbclid,
    referrer: a.referrer,
    utmSource: a.utm_source,
    utmMedium: a.utm_medium,
    utmCampaign: a.utm_campaign,
    utmTerm: a.utm_term,
    utmContent: a.utm_content,
  };
}
