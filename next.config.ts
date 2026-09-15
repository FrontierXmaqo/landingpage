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

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://images.leadconnectorhq.com/**"),
      new URL("https://assets.cdn.filesafe.space/**"),
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/admin/:path*", headers: adminHeaders },
    ];
  },
};

export default nextConfig;
