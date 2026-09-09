import type { NextConfig } from "next";

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
};

export default nextConfig;
