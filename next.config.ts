import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ hostname: "http://www.w3.org" }],
	},
	reactCompiler: true,
	experimental: {
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
