import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const sessionCookie = getSessionCookie(request);

	const isOnPrivatePages =
		pathname.includes("/app") || pathname.includes("/setup");
	const isOnLoginPage = pathname.includes("/auth");

	if (!sessionCookie && isOnPrivatePages) {
		return NextResponse.redirect(new URL("/auth/sign-in", request.url));
	}

	if (sessionCookie && isOnLoginPage) {
		return NextResponse.redirect(new URL("/app/dashboard", request.url));
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};
