import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

const LOCAL_MOBILE_ORIGINS = new Set([
	"http://localhost:3000",
	"http://localhost:3001",
	"http://localhost:8081",
	"http://localhost:8082",
	"http://localhost:19006",
	"http://127.0.0.1:3000",
	"http://127.0.0.1:3001",
	"http://127.0.0.1:8081",
	"http://127.0.0.1:8082",
	"http://127.0.0.1:19006",
]);

const PRIVATE_NETWORK_ORIGIN =
	/^http:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/;

function getAllowedMobileOrigin(origin: string | null) {
	if (!origin) return null;
	if (LOCAL_MOBILE_ORIGINS.has(origin)) return origin;
	if (PRIVATE_NETWORK_ORIGIN.test(origin)) return origin;
	return null;
}

function applyMobileCors(response: NextResponse, origin: string) {
	response.headers.set("Access-Control-Allow-Origin", origin);
	response.headers.set("Access-Control-Allow-Credentials", "true");
	response.headers.set(
		"Access-Control-Allow-Methods",
		"GET,POST,PUT,DELETE,OPTIONS",
	);
	response.headers.set(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, X-Requested-With",
	);
	response.headers.set("Vary", "Origin");
	return response;
}

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const isCorsApi =
		pathname.startsWith("/api/mobile") || pathname.startsWith("/api/auth");

	if (isCorsApi) {
		const allowedOrigin = getAllowedMobileOrigin(request.headers.get("origin"));

		if (request.method === "OPTIONS") {
			const response = new NextResponse(null, { status: 204 });
			return allowedOrigin
				? applyMobileCors(response, allowedOrigin)
				: response;
		}

		const response = NextResponse.next();
		return allowedOrigin ? applyMobileCors(response, allowedOrigin) : response;
	}

	const sessionCookie = getSessionCookie(request);

	const isOnPrivatePages =
		pathname.includes("/app") || pathname.includes("/onboarding");
	const isOnLoginPage = pathname.includes("/auth");

	if (!sessionCookie && isOnPrivatePages) {
		const signInUrl = new URL("/auth/sign-in", request.url);
		const dest = request.nextUrl.pathname + request.nextUrl.search;
		signInUrl.searchParams.set("redirect", dest);
		return NextResponse.redirect(signInUrl);
	}

	if (sessionCookie && !isOnPrivatePages) {
		const redirectTo = request.nextUrl.searchParams.get("redirect");
		const dest = redirectTo?.startsWith("/") ? redirectTo : "/app/dashboard";
		return NextResponse.redirect(new URL(dest, request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/api/mobile/:path*",
		"/api/auth/:path*",
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
