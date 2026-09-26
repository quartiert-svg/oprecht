import { NextRequest, NextResponse } from "next/server";
import { jsonError, logRequest } from "@/lib/api";
import { getUserFromRequest, toMe } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  logRequest(req, "/api/me");
  const user = await getUserFromRequest(req);
  if (!user) {
    return jsonError(401, "unauthorized", "Authentication required");
  }
  return NextResponse.json(toMe(user));
}
