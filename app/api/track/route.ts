import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { cleanPath, cleanText, clientIp, isCrossOrigin, readJsonBody } from "@/lib/trackingRequest";

const EVENT_TYPES = ["pageview", "calculator_start", "calculator_complete"] as const;
const TRACK_LIMIT_PER_MINUTE = 30;

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  // Own bucket, separate from lead submissions ("lead:"), and roomy enough for
  // a whole visit's events from visitors sharing one mobile-carrier IP.
  if (!checkRateLimit(`track:${clientIp(request)}`, { maxRequests: TRACK_LIMIT_PER_MINUTE }).allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  // Bound the request before parsing: an unbounded body is a cheap DoS.
  const body = (await readJsonBody(request, 2000)) as Record<string, unknown> | null;
  const eventType = body?.event_type;
  const sessionId = cleanText(body?.session_id, 100);
  const path = cleanPath(body?.path);
  if (!EVENT_TYPES.includes(eventType as (typeof EVENT_TYPES)[number]) || !sessionId || !path) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await getSupabaseServiceClient().from("analytics_events").insert({
    event_type: eventType,
    session_id: sessionId,
    path,
    utm_source: cleanText(body?.utm_source, 100),
  });

  return NextResponse.json({ ok: true });
}
