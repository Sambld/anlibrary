import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware } from "./middlewares/auth-middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    return authMiddleware(request);
  }
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("Host");
  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  ) {
    return new NextResponse(null, {
      status: 403,
    });
  }

  return NextResponse.next();
}
