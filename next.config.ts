import type { NextConfig } from "next";
import "./src/env";

const nextConfig = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fitcalendr.com"),
	async headers() {
		return [
			{
				source: "/api/mobile/:path*",
				headers: [
					{ key: "Access-Control-Allow-Origin", value: "*" },
					{ key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
					{ key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
				],
			},
		];
	},
	async redirects() {
		return [
			{ source: "/calendar", destination: "/app/calendar", permanent: false },
			{ source: "/dashboard", destination: "/app/dashboard", permanent: false },
		];
	},
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
