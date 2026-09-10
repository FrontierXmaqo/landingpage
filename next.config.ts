import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://images.leadconnectorhq.com/**"),
      new URL("https://assets.cdn.filesafe.space/**"),
      new URL("https://aikosolar.com/**"),
      new URL("https://www.huawei.com/**"),
      new URL("https://www.fox-ess.com/**"),
      new URL("https://web-cdn.livoltek.com/**"),
      new URL("https://wwwstatic.sigenergy.com/**"),
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
