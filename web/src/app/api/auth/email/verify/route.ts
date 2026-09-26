import { NextRequest, NextResponse } from "next/server";
import { jsonError, logRequest } from "@/lib/api";
import { consumeToken, markEmailVerified } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  logRequest(req, "/api/auth/email/verify");
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body must be JSON");
  }

  const token = body.token || "";
  if (!token) {
    return jsonError(400, "validation_error", "token required");
  }

  const record = await consumeToken(token, "email_verify");
  if (!record) {
    return jsonError(400, "invalid_token", "Invalid or expired verify token");
  }

  await markEmailVerified(record.userId);
  return new NextResponse(null, { status: 204 });
}
