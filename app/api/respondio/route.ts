import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { readJsonBody } from "@/lib/trackingRequest";
import { readHiddenRef } from "@/lib/whatsapp";

/**
 * respond.io's webhooks (Settings → Integrations → Webhooks) post here, and this
 * keeps the lead's Lark row in step with respond.io:
 *
 * - "New Incoming Message": the first message from a form visitor carries the
 *   lead's ref id hidden in it (lib/whatsapp.ts). The ref id and the respond.io
 *   contact id go to LARK_LINK_WEBHOOK_URL, whose Lark automation finds the row
 *   by Ref ID, fills in its Contact ID and sets Lead Status to "New Lead".
 *   Messages without a ref id are ignored.
 * - "Contact Lifecycle Updated": the contact id and the new lifecycle stage go
 *   to LARK_STATUS_WEBHOOK_URL, whose automation finds the row by Contact ID and
 *   sets Lead Status to that stage.
 *
 * respond.io calls this with ?key=RESPONDIO_WEBHOOK_KEY in the URL. A Lark error
 * answers 502 so respond.io sends the event again.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.RESPONDIO_WEBHOOK_KEY ?? "";
  const given = request.nextUrl.searchParams.get("key") ?? "";
  if (!expected || given.length !== expected.length || !timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = (await readJsonBody(request, 100_000)) as RespondioEvent | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });

  const contactId = String(body.contact?.id ?? body.message?.contactId ?? "").slice(0, 50);
  if (!contactId) return NextResponse.json({ ok: true, skipped: "no contact" });

  // Read before any text cleaning: the ref id is made of invisible characters that cleaning removes.
  const refId = readHiddenRef(String(body.message?.message?.text ?? ""));
  if (refId) {
    return forward("LARK_LINK_WEBHOOK_URL", { ref_id: refId, contact_id: contactId, lead_status: "New Lead" });
  }

  const lifecycle = String(body.lifecycle ?? (/lifecycle/i.test(body.event_type ?? "") ? (body.contact?.lifecycle ?? "") : "")).slice(0, 80);
  if (lifecycle) {
    return forward("LARK_STATUS_WEBHOOK_URL", { contact_id: contactId, lead_status: lifecycle });
  }

  return NextResponse.json({ ok: true, skipped: "nothing to update" });
}

/** The parts of respond.io's webhook bodies this reads; anything missing is skipped. */
type RespondioEvent = {
  event_type?: string;
  contact?: { id?: string | number; lifecycle?: string };
  message?: { contactId?: string | number; message?: { text?: string } };
  lifecycle?: string;
};

async function forward(envVar: "LARK_LINK_WEBHOOK_URL" | "LARK_STATUS_WEBHOOK_URL", payload: Record<string, string>) {
  const url = process.env[envVar];
  if (!url?.startsWith("https://")) {
    console.error(`${envVar} is not set to an https:// URL; respond.io event not passed on.`);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Lark responded with ${res.status}`);
    console.log(`respond.io -> ${envVar}: ${JSON.stringify(payload)}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`respond.io -> ${envVar} failed`, err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
