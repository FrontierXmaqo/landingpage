import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * The old get.maqosolar.com site (a static copy) and the Philippines site live
 * in the separate `get-maqo-solar-lp` Vercel project. This site owns the
 * get.maqosolar.com domain and forwards these paths to it, so visitors stay on
 * one domain:
 *
 *   /lp/...      the old get.maqosolar.com pages
 *   /phil/...    the Philippines site
 *   /api/submit, /api/ph-submit, /api/tags   the old pages' form and tracking functions
 *
 * Environment:
 *   LEGACY_SITE_ORIGIN      the get-maqo-solar-lp deployment to forward to
 *   LEGACY_SITE_BYPASS      that project's "Protection Bypass for Automation"
 *                           secret; its vercel.app URLs are behind Vercel
 *                           Authentication, so without it every page is a 401
 *   LP_PROXY_SECRET         shared with get-maqo-solar-lp. Vercel replaces
 *                           x-forwarded-for on the hop between projects, so the
 *                           visitor's IP goes in x-maqo-client-ip with this
 *                           secret, for the forms' rate limit and Turnstile.
 */
const LEGACY_ORIGIN = process.env.LEGACY_SITE_ORIGIN || "https://get-maqo-solar-lp-gold.vercel.app";

const LEGACY_PREFIXES = ["/lp", "/phil"];
const LEGACY_API = new Set(["/api/submit", "/api/ph-submit", "/api/tags"]);

export function isLegacyPath(pathname: string) {
  return (
    LEGACY_API.has(pathname) ||
    LEGACY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  );
}

export function forwardToLegacySite(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The static pages use relative links ("../assets/..."), which only resolve
  // from a URL that ends in a slash, as on the old site.
  if (!LEGACY_API.has(pathname) && !pathname.endsWith("/") && !/\.\w+$/.test(pathname)) {
    // A plain URL: NextURL re-applies the request's own trailing-slash style.
    const withSlash = new URL(request.url);
    withSlash.pathname = `${pathname}/`;
    return NextResponse.redirect(withSlash, 308);
  }

  const headers = new Headers(request.headers);
  // Never let a visitor supply these themselves.
  headers.delete("x-maqo-client-ip");
  headers.delete("x-maqo-proxy-secret");
  const proxySecret = process.env.LP_PROXY_SECRET;
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (proxySecret && clientIp) {
    headers.set("x-maqo-client-ip", clientIp);
    headers.set("x-maqo-proxy-secret", proxySecret);
  }
  const bypass = process.env.LEGACY_SITE_BYPASS;
  if (bypass) headers.set("x-vercel-protection-bypass", bypass);

  return NextResponse.rewrite(new URL(pathname + search, LEGACY_ORIGIN), { request: { headers } });
}
