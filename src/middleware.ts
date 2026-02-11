import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];
const PROTECTED_PREFIXES = ["/admin", "/account"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("irun_session");

  // Auth pages: redirect to /account if already logged in
  if (AUTH_PATHS.includes(pathname) && sessionCookie) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // Protected paths: redirect to /login if not logged in
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isProtected && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts|images|api/health).*)"],
};
