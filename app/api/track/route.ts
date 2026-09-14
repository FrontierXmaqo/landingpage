import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

const EVENT_TYPES = ["pageview", "calculator_start", "calculator_complete"] as const;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!checkRateLimit(ip).allowed) return NextResponse.json({ ok: false }, { status: 429 });

  const body = await request.json().catch(() => null);
  const eventType = body?.event_type;
  const sessionId = String(body?.session_id || "").slice(0, 100);
  if (!EVENT_TYPES.includes(eventType) || !sessionId) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await getSupabaseServiceClient().from("analytics_events").insert({
    event_type: eventType,
    session_id: sessionId,
    path: String(body?.path || "").slice(0, 300),
    utm_source: body?.utm_source ? String(body.utm_source).slice(0, 100) : null,
  });

  return NextResponse.json({ ok: true });
}
