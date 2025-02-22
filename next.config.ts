import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "http://www.w3.org" }],
  },
  experimental: {
    reactCompiler: true,
    staleTimes: {
      dynamic: 30,
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
