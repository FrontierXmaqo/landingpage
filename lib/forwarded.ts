import { timingSafeEqual } from "node:crypto";

/**
 * The /homepage copy of this site is reached through the get-maqo-solar-lp
 * project (get.maqosolar.com), which forwards /homepage/* here. Vercel
 * replaces x-forwarded-for on that hop, and Host is this project's own
 * vercel.app address, so that project's middleware passes the visitor's IP and
 * the public host in x-maqo-client-ip / x-maqo-forwarded-host, signed with
 * LP_PROXY_SECRET (set in both projects). Without a matching secret they are
 * ignored, so a visitor can't set them.
 */
function trusted(headers: Headers) {
  const secret = process.env.LP_PROXY_SECRET;
  const sent = headers.get("x-maqo-proxy-secret");
  if (!secret || !sent) return false;
  const a = Buffer.from(sent);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function visitorIp(headers: Headers) {
  const forwarded = trusted(headers) ? headers.get("x-maqo-client-ip") : null;
  const ip = forwarded || headers.get("x-forwarded-for") || headers.get("x-real-ip");
  return ip?.split(",")[0].trim() || "unknown";
}

/** The host the visitor sees, e.g. "get.maqosolar.com" or "get.maqo.asia". */
export function visitorHost(headers: Headers) {
  const forwarded = trusted(headers) ? headers.get("x-maqo-forwarded-host") : null;
  return (forwarded || headers.get("host") || "").split(",")[0].trim();
}
