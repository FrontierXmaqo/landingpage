import type { NextRequest } from "next/server";

/**
 * Shared guards for the public analytics endpoints (/api/track, /api/track-perf).
 * They're unauthenticated by nature — every visitor's browser posts to them —
 * so these only raise the cost of forging or bloating data; they can't make a
 * forged beacon impossible.
 */

/** Longest duration a single page view can plausibly report. */
export const MAX_DURATION_MS = 24 * 60 * 60 * 1000;

export function clientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

/**
 * A browser posting a beacon from another site sends that site's Origin, so a
 * mismatch is rejected. A missing Origin is allowed: some browsers omit it on
 * same-origin beacons, and dropping those would lose real visits.
 */
export function isCrossOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== request.headers.get("host");
  } catch {
    return true;
  }
}

/**
 * Reads and parses the JSON body, refusing anything over `maxBytes`. Measures
 * the body itself rather than trusting Content-Length, which a chunked request
 * simply leaves out.
 */
export async function readJsonBody(request: NextRequest, maxBytes: number): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxBytes) return null;
  const text = await request.text().catch(() => "");
  if (!text || text.length > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Free text: control characters stripped, length-capped; null when empty. */
export function cleanText(value: unknown, max: number): string | null {
  if (value == null) return null;
  const out = String(value).replace(/[\p{Cc}\p{Cf}]/gu, "").trim().slice(0, max);
  return out || null;
}

/** An in-site path ("/en/atap"), or null. */
export function cleanPath(value: unknown): string | null {
  const path = cleanText(value, 300);
  return path && path.startsWith("/") && !path.startsWith("//") ? path : null;
}

export function clampMs(value: unknown) {
  return Math.max(0, Math.min(MAX_DURATION_MS, Math.round(Number(value) || 0)));
}
