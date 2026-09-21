import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * Receives one page view's behaviour summary.
 *
 * The browser beacons the same view_id more than once as the visit
 * progresses (on tab-hide, then again at unload), so this upserts rather than
 * inserts: a view is one row that fills in. Beacons for a single page arrive
 * in order, and the unload beacon carries the final numbers.
 */

const SEGMENTS = ["residential", "ci", "ev", "shared"] as const;
const DEVICES = ["desktop", "tablet", "mobile"] as const;
const REFERRERS = ["google", "social", "direct", "other"] as const;

const oneOf = <T extends readonly string[]>(list: T, value: unknown, fallback: T[number]): T[number] =>
  typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T[number]) : fallback;

/** Clamps to the range the column's CHECK constraint allows, so bad input is
 *  bounded rather than rejected — a dropped view is worse than a capped one. */
const int = (value: unknown, max: number) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(Math.round(n), max);
};

const str = (value: unknown, max: number) => (typeof value === "string" ? value.slice(0, max) : null);

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!checkRateLimit(ip).allowed) return NextResponse.json({ ok: false }, { status: 429 });

  // Bound the request before parsing: an unbounded body is a cheap DoS.
  if (Number(request.headers.get("content-length") ?? 0) > 2000) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  const body = await request.json().catch(() => null);
  const viewId = str(body?.view_id, 100);
  const sessionId = str(body?.session_id, 100);
  const path = str(body?.path, 300);
  if (!viewId || !sessionId || !path) return NextResponse.json({ ok: false }, { status: 400 });

  // Country comes from the edge, which reads the IP we never store ourselves.
  const country = request.headers.get("x-vercel-ip-country");

  const { error } = await getSupabaseServiceClient()
    .from("analytics_pageviews")
    .upsert(
      {
        view_id: viewId,
        session_id: sessionId,
        path,
        segment: oneOf(SEGMENTS, body?.segment, "shared"),
        device: oneOf(DEVICES, body?.device, "desktop"),
        referrer_kind: oneOf(REFERRERS, body?.referrer_kind, "direct"),
        country: country ? country.slice(0, 2) : null,
        utm_source: str(body?.utm_source, 100),
        is_new_session: body?.is_new_session !== false,
        scroll_depth: int(body?.scroll_depth, 100),
        // ~2.4 days, well past any real visit; keeps a bad clock from overflowing int4.
        active_ms: int(body?.active_ms, 200_000_000),
        total_ms: int(body?.total_ms, 200_000_000),
        rage_clicks: int(body?.rage_clicks, 1000),
        dead_clicks: int(body?.dead_clicks, 1000),
        excess_scroll: body?.excess_scroll === true,
        quick_back: body?.quick_back === true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "view_id" },
    );

  if (error) console.error("analytics_pageviews upsert error", error);

  return NextResponse.json({ ok: true });
}
