import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // frame-ancestors in the CSP covers modern browsers; this is the legacy equivalent.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

/** The CMS must never be cached by a shared proxy or indexed by a crawler. */
const adminHeaders = [
  { key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" },
  { key: "X-Robots-Tag", value: "noindex, nofollow" },
];

/**
 * Top-level paths of the old get.maqosolar.com site, which now lives under /lp
 * (see lib/legacySite.ts). Old ads, Google results and shared links keep working.
 */
const LEGACY_SITE_PATHS = [
  "-842225",
  "battery-energy-storage-system-malaysia",
  "career",
  "commercial-and-industrial-landing-page",
  "commercial-industry",
  "commercial-solar",
  "let-the-sun-pay-for-you-blog",
  "let-the-sun-pay-for-you-contact",
  "post",
  "residential-landing-page",
  "solar-battery-energy-storage-system",
  "solar-pv-self-consumption",
  "thank-you-page-let-the-sun-pay-for-you",
];

const nextConfig: NextConfig = {
  // The /lp and /phil pages need their trailing slash; proxy.ts strips it everywhere else.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      new URL("https://images.leadconnectorhq.com/**"),
      new URL("https://assets.cdn.filesafe.space/**"),
      // Project photos uploaded through the CMS.
      new URL("https://yhpsidiipdassknsggcz.supabase.co/storage/v1/object/public/**"),
    ],
  },
  experimental: {
    // Default is 1MB, which a phone photo blows past instantly. The upload
    // action caps the file at 10MB itself and returns a readable error; this
    // just has to be the larger of the two so the request reaches it.
    serverActions: { bodySizeLimit: "12mb" },
  },
  async redirects() {
    return [
      ...LEGACY_SITE_PATHS.map((path) => ({
        source: `/${path}/:rest*`,
        destination: `/lp/${path}/:rest*`,
        permanent: true,
      })),
      { source: "/philippines/:rest*", destination: "/phil/:rest*", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
};

export default nextConfig;
