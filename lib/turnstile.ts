const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 5000;

/**
 * Verifies a Cloudflare Turnstile token server-side.
 *
 * - Both keys configured: the token must verify, for this site's hostname.
 * - Site key set but secret missing (half-configured, or the secret was
 *   removed): fails closed, since the widget is showing and a missing secret
 *   can only be a misconfiguration.
 * - Neither key configured: Turnstile isn't set up for this deployment yet, so
 *   the form keeps working, but every submission logs an error so the gap in
 *   bot protection can't go unnoticed.
 *
 * `requestHost` is the host the form was submitted to; in production the
 * token's hostname must match it, so a token solved on another site that
 * happens to use the same site key can't be replayed here.
 */
export async function verifyTurnstileToken(token: string, remoteIp: string, requestHost: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!secretKey) {
    if (siteKey) {
      console.error("TURNSTILE_SECRET_KEY is missing while the site key is set; rejecting submission.");
      return false;
    }
    console.error("Turnstile is not configured (no TURNSTILE_SECRET_KEY / NEXT_PUBLIC_TURNSTILE_SITE_KEY); lead forms have no bot protection.");
    return true;
  }
  if (!token) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token, remoteip: remoteIp }),
      signal: controller.signal,
    });
    const data = (await res.json()) as { success?: boolean; hostname?: string };
    if (data.success !== true) return false;

    // Cloudflare's test keys report "example.com", so only enforce on production.
    if (process.env.VERCEL_ENV === "production" && data.hostname && requestHost && data.hostname !== requestHost) {
      console.error(`Turnstile token was issued for ${data.hostname}, not ${requestHost}; rejecting.`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Turnstile verification request failed", err);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
