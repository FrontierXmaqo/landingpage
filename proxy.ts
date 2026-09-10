import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Nonce + 'strict-dynamic' lets the GTM bootstrap script (loaded with this
// nonce) inject its own configured tags (Ads, Clarity, LinkedIn, Meta Pixel,
// etc.) without hand-maintaining a script-src allowlist that would silently
// break every time a tag is added in the GTM dashboard. connect-src/img-src/
// frame-src stay https-only rather than domain-locked for the same reason:
// GTM's tag list changes outside this codebase.
function buildCsp(nonce: string) {
  // React's dev mode needs eval() for its debugging tools; it never uses
  // eval() in production, so this relaxation is dev-only.
  const scriptSrc = process.env.NODE_ENV === "development"
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval' https:`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`;

  return [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-src https://www.googletagmanager.com https://challenges.cloudflare.com https://www.facebook.com https://td.doubleclick.net",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
