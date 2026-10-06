/**
 * Absolute origin the public site is served from. Next resolves every relative
 * URL in `metadata` against this, which is what turns the canonical and
 * hreflang links into the absolute URLs Google requires — a relative hreflang
 * is silently ignored by crawlers.
 *
 * Override per deployment (preview branches, the .my domain) with
 * NEXT_PUBLIC_SITE_URL; the default is the production landing page.
 */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://get.maqo.asia",
);
