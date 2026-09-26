import { NextRequest, NextResponse } from "next/server";
import { jsonError, logRequest } from "@/lib/api";
import {
  consumeToken,
  findUserById,
  revokeAllSessionsForUser,
  updateUserPassword,
} from "@/lib/db";
import { hashPassword, validatePassword } from "@/lib/password";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  logRequest(req, "/api/auth/password/reset");
  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body must be JSON");
  }

  const token = body.token || "";
  const password = body.password || "";
  if (!token || !password) {
    return jsonError(400, "validation_error", "token and password required");
  }

  const record = await consumeToken(token, "password_reset");
  if (!record) {
    return jsonError(400, "invalid_token", "Invalid or expired reset token");
  }

  const user = await findUserById(record.userId);
  if (!user) {
    return jsonError(400, "invalid_token", "Invalid or expired reset token");
  }

  const pw = validatePassword(password, user.email);
  if (!pw.ok) {
    return jsonError(400, pw.code, pw.message);
  }

  await updateUserPassword(user.id, await hashPassword(password));
  await revokeAllSessionsForUser(user.id);
  return new NextResponse(null, { status: 204 });
}
