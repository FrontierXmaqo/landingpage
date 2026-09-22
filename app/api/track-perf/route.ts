import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

const SEGMENTS = ["residential", "ci", "ev", "shared"] as const;
const DEVICES = ["desktop", "tablet", "mobile"] as const;
const REFERRER_KINDS = ["google", "social", "direct", "other"] as const;
const MAX_SECTIONS = 20;

function isOneOf<T extends string>(values: readonly T[], v: unknown): v is T {
  return typeof v === "string" && (values as readonly string[]).includes(v);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!checkRateLimit(`perf:${ip}`).allowed) return NextResponse.json({ ok: false }, { status: 429 });

  // Bound the request before parsing: an unbounded body is a cheap DoS.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > 4000) return NextResponse.json({ ok: false }, { status: 413 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const viewId = String(body.view_id || "").slice(0, 100);
  const sessionId = String(body.session_id || "").slice(0, 100);
  if (!viewId || !sessionId) return NextResponse.json({ ok: false }, { status: 400 });
  if (!isOneOf(SEGMENTS, body.segment)) return NextResponse.json({ ok: false }, { status: 400 });
  if (!isOneOf(DEVICES, body.device)) return NextResponse.json({ ok: false }, { status: 400 });
  if (!isOneOf(REFERRER_KINDS, body.referrer_kind)) return NextResponse.json({ ok: false }, { status: 400 });

  const scrollDepth = Math.max(0, Math.min(100, Math.round(Number(body.scroll_depth) || 0)));
  const activeMs = Math.max(0, Math.round(Number(body.active_ms) || 0));
  const totalMs = Math.max(0, Math.round(Number(body.total_ms) || 0));

  // Cap keys/values so a crafted payload can't grow the jsonb column unbounded.
  const rawDwell = body.section_dwell && typeof body.section_dwell === "object" ? body.section_dwell : {};
  const sectionDwell: Record<string, number> = {};
  for (const [key, value] of Object.entries(rawDwell).slice(0, MAX_SECTIONS)) {
    const ms = Math.max(0, Math.round(Number(value) || 0));
    if (ms > 0) sectionDwell[String(key).slice(0, 60)] = ms;
  }

  // Country comes from the edge, which reads the IP we never store ourselves.
  const country = request.headers.get("x-vercel-ip-country");

  await getSupabaseServiceClient()
    .from("analytics_pageviews")
    .upsert(
      {
        view_id: viewId,
        session_id: sessionId,
        path: String(body.path || "").slice(0, 300),
        segment: body.segment,
        device: body.device,
        referrer_kind: body.referrer_kind,
        country: country ? country.slice(0, 2) : null,
        utm_source: body.utm_source ? String(body.utm_source).slice(0, 100) : null,
        is_new_session: Boolean(body.is_new_session),
        scroll_depth: scrollDepth,
        active_ms: activeMs,
        total_ms: totalMs,
        section_dwell: sectionDwell,
        form_started: Boolean(body.form_started),
        form_last_field: body.form_last_field ? String(body.form_last_field).slice(0, 100) : null,
      },
      { onConflict: "view_id" }
    );

  return NextResponse.json({ ok: true });
}
