import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "http://www.w3.org" }],
  },
  experimental: {
    reactCompiler: true,
  },
};

export default nextConfig;
