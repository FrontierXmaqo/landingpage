import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

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

/** Refreshes the Supabase auth session cookie and gates /admin/* to signed-in users. */
async function guardAdmin(request: NextRequest, requestHeaders: Headers) {
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    "https://yhpsidiipdassknsggcz.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: requestHeaders } });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!user && !isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    return NextResponse.redirect(redirectUrl);
  }
  if (user && isLoginPage) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin";
    return NextResponse.redirect(redirectUrl);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const response = await guardAdmin(request, requestHeaders);
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  // ?site=ev on the homepage serves the /ev landing page while the URL bar
  // still shows "/?site=ev" — lets the EV page share this project/domain
  // without a real subdomain.
  if (pathname === "/" && searchParams.get("site") === "ev") {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = "/ev";
    const response = NextResponse.rewrite(rewritten, { request: { headers: requestHeaders } });
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
};
