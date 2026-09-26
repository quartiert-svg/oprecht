import { NextRequest, NextResponse } from "next/server";
import { logRequest } from "@/lib/api";
import {
  clearSessionCookie,
  extractBearer,
  verifyAccessToken,
} from "@/lib/auth";
import { revokeAllSessionsForUser, revokeSessionByRefresh } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  logRequest(req, "/api/auth/logout");
  let refreshToken: string | undefined;
  try {
    const body = await req.json();
    refreshToken = body?.refreshToken;
  } catch {
    // empty body OK
  }

  if (refreshToken) {
    await revokeSessionByRefresh(refreshToken);
  } else {
    const bearer = extractBearer(req);
    if (bearer) {
      const claims = await verifyAccessToken(bearer);
      if (claims?.sub) await revokeAllSessionsForUser(claims.sub);
    }
  }

  await clearSessionCookie();
  return new NextResponse(null, { status: 204 });
}
