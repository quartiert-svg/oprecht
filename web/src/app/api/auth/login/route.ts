import { NextRequest, NextResponse } from "next/server";
import { clientIp, jsonError, logRequest } from "@/lib/api";
import { issueAuthSession, setSessionCookie } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  logRequest(req, "/api/auth/login");
  const ip = clientIp(req) || "unknown";
  const limited = rateLimit(`login:${ip}`, 20, 60_000);
  if (!limited.allowed) {
    return jsonError(429, "rate_limited", "Too many login attempts", {
      retryAfterSec: limited.retryAfterSec,
    });
  }

  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json", "Request body must be JSON");
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return jsonError(401, "invalid_credentials", "Invalid email or password");
  }

  const user = await findUserByEmail(email);
  const ok = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !ok) {
    return jsonError(401, "invalid_credentials", "Invalid email or password");
  }

  const session = await issueAuthSession(user);
  await setSessionCookie(session.accessToken, session.expiresIn);
  return NextResponse.json(session);
}
