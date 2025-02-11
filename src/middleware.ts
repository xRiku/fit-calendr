// // import { auth } from "@/auth";

// // export default auth;

// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth";

// export async function middleware(request: NextRequest) {
//   // const sessionCookie = getSessionCookie(request);
//   // if (!sessionCookie) {
//   //   return NextResponse.redirect(new URL("/", request.url));
//   // }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
  // const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.
  // if (!sessionCookie) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ], // Specify the routes the middleware applies to
};
