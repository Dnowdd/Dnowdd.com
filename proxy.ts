import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isStaticAsset = (pathname: string) =>
  /\.[a-z0-9]+$/i.test(pathname) ||
  pathname.startsWith("/_next") ||
  pathname.startsWith("/api");

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}
