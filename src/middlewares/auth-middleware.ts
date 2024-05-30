import { createHash } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { validateRequest, validateRequestAction } from "@/lib/auth/lucia";
import { LOGIN_URL } from "@/constants/consts";

export async function authMiddleware(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // List of paths that requestuire authentication
  const protectedPaths = ["/library"];

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth`,
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
