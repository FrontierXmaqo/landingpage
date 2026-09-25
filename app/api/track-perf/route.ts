import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSupabaseServiceClient } from "@/lib/supabase/server";
import { clampMs, cleanPath, cleanText, clientIp, isCrossOrigin, readJsonBody } from "@/lib/trackingRequest";

const SEGMENTS = ["residential", "ci", "ev", "shared"] as const;
const DEVICES = ["desktop", "tablet", "mobile"] as const;
const REFERRER_KINDS = ["google", "social", "direct", "other"] as const;
const MAX_SECTIONS = 20;
// Each page view flushes on every tab switch and on leaving, so a visit sends
// several of these; the limit leaves room for that and for shared mobile IPs.
const PERF_LIMIT_PER_MINUTE = 60;

function isOneOf<T extends string>(values: readonly T[], v: unknown): v is T {
  return typeof v === "string" && (values as readonly string[]).includes(v);
}

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!checkRateLimit(`perf:${clientIp(request)}`, { maxRequests: PERF_LIMIT_PER_MINUTE }).allowed) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  // Bound the request before parsing: an unbounded body is a cheap DoS.
  const body = (await readJsonBody(request, 4000)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const viewId = cleanText(body.view_id, 100);
  const sessionId = cleanText(body.session_id, 100);
  const path = cleanPath(body.path);
  if (!viewId || !sessionId || !path) return NextResponse.json({ ok: false }, { status: 400 });
  if (!isOneOf(SEGMENTS, body.segment)) return NextResponse.json({ ok: false }, { status: 400 });
  if (!isOneOf(DEVICES, body.device)) return NextResponse.json({ ok: false }, { status: 400 });
  if (!isOneOf(REFERRER_KINDS, body.referrer_kind)) return NextResponse.json({ ok: false }, { status: 400 });

  const scrollDepth = Math.max(0, Math.min(100, Math.round(Number(body.scroll_depth) || 0)));
  // Capped at a day so one forged beacon can't skew every average on the dashboard.
  const activeMs = clampMs(body.active_ms);
  const totalMs = clampMs(body.total_ms);

  // Cap keys/values so a crafted payload can't grow the jsonb column unbounded.
  const rawDwell = body.section_dwell && typeof body.section_dwell === "object" ? body.section_dwell : {};
  const sectionDwell: Record<string, number> = {};
  for (const [key, value] of Object.entries(rawDwell).slice(0, MAX_SECTIONS)) {
    const ms = clampMs(value);
    const id = cleanText(key, 60);
    if (ms > 0 && id) sectionDwell[id] = ms;
  }

  // Country comes from the edge, which reads the IP we never store ourselves.
  const country = request.headers.get("x-vercel-ip-country");

  await getSupabaseServiceClient()
    .from("analytics_pageviews")
    .upsert(
      {
        view_id: viewId,
        session_id: sessionId,
        path,
        segment: body.segment,
        device: body.device,
        referrer_kind: body.referrer_kind,
        country: country ? country.slice(0, 2) : null,
        utm_source: cleanText(body.utm_source, 100),
        is_new_session: Boolean(body.is_new_session),
        scroll_depth: scrollDepth,
        active_ms: activeMs,
        total_ms: totalMs,
        section_dwell: sectionDwell,
        form_started: Boolean(body.form_started),
        form_last_field: cleanText(body.form_last_field, 100),
      },
      { onConflict: "view_id" }
    );

  return NextResponse.json({ ok: true });
}
