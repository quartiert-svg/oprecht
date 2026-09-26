import { NextRequest, NextResponse } from "next/server";
import { clientIp, logRequest } from "@/lib/api";
import { createToken, findUserByEmail } from "@/lib/db";
import { log } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  logRequest(req, "/api/auth/password/forgot");
  const ip = clientIp(req) || "unknown";
  const limited = rateLimit(`forgot:${ip}`, 5, 60_000);
  if (!limited.allowed) {
    // Still 204 to avoid timing/enumeration asymmetry beyond rate limits.
    return new NextResponse(null, { status: 204 });
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email || "")
      .trim()
      .toLowerCase();
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  if (email) {
    const user = await findUserByEmail(email);
    if (user) {
      const token = await createToken(
        user.id,
        "password_reset",
        1000 * 60 * 60,
      );
      log.info("password_reset_stub", {
        userId: user.id,
        email: user.email,
        token: token.token,
        locale: user.locale,
      });
    }
  }

  return new NextResponse(null, { status: 204 });
}
