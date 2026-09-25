import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseUserClient } from "@/lib/supabase/server";

/**
 * Where a staff invite email lands. The link carries a one-time token_hash
 * (see the Supabase "Invite user" email template), verified here on the
 * server, which then sets the session as an httpOnly cookie.
 *
 * This replaces Supabase's default flow, which put live access and refresh
 * tokens in the URL fragment of the public site, where Google Tag Manager,
 * Clarity and the Meta Pixel all run and can read the page address. The admin
 * area loads none of those scripts, and the token here is single-use.
 */
export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  if (tokenHash && type === "invite") {
    const supabase = await getSupabaseUserClient();
    const { error } = await supabase.auth.verifyOtp({ type: "invite", token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL("/admin/auth/set-password", request.url));
    console.warn("Invite link verification failed", error.code ?? error.message);
  }

  return NextResponse.redirect(new URL("/admin/login?invite=invalid", request.url));
}
