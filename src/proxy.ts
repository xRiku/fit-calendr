import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
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
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
