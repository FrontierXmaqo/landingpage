import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SESSION_COOKIE_OPTIONS } from "@/lib/supabase/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, hasLocale, type Locale } from "@/lib/i18n/config";

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

/**
 * Paths that are NOT part of the public, translated marketing site and must
 * never be given a language prefix. The internal CMS is English-only staff
 * software, and /api routes are called by scripts, not visitors — sending
 * either through the locale redirect below would turn /admin into /en/admin
 * and 404 the whole CMS.
 */
function isUnlocalized(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/api");
}

function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  return saved && hasLocale(saved) ? saved : DEFAULT_LOCALE;
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
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, { ...options, ...SESSION_COOKIE_OPTIONS })
          );
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
  const { pathname, searchParams } = request.nextUrl;
  const firstSegment = pathname.split("/")[1] ?? "";

  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  // The CMS is checked before any locale handling, so /admin keeps its bare path.
  if (pathname.startsWith("/admin")) {
    const response = await guardAdmin(request, requestHeaders);
    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  // Every public page lives under /en, /cn or /ms. Unprefixed links (old ads,
  // bookmarks, "/about") redirect to the visitor's saved language, keeping the
  // query string so campaign_id / utm / gclid still reach the lead form. Paths
  // with a file extension are public assets and pass through untouched.
  if (!isUnlocalized(pathname) && !hasLocale(firstSegment) && !pathname.includes(".")) {
    const redirected = request.nextUrl.clone();
    redirected.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(redirected);
  }

  // ?site=ev on a language homepage serves that language's EV landing page while
  // the URL bar still shows "/en?site=ev". Lets the EV page share this
  // project/domain without a real subdomain.
  if (hasLocale(firstSegment) && pathname === `/${firstSegment}` && searchParams.get("site") === "ev") {
    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/${firstSegment}/ev`;
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
