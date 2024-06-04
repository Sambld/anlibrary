import { NextRequest, NextResponse } from "next/server";


export async function authMiddleware(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // List of paths that requestuire authentication
  const protectedPaths = ["/library"];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const response = await fetch(
      new URL('/api/auth', request.url),
      {
        method: "GET",
        // credentials: "include",
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );
    if (response.status === 401) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }
  return NextResponse.next();
}
