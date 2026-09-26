import { NextRequest, NextResponse } from "next/server";
import { isAdult } from "@/lib/age";
import { clientIp, jsonError, logRequest } from "@/lib/api";
import {
  issueAuthSession,
  setSessionCookie,
} from "@/lib/auth";
import { createToken, createUser, findUserByEmail } from "@/lib/db";
import { log } from "@/lib/logger";
import { hashPassword, validatePassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

type Body = {
  email?: string;
  password?: string;
  gender?: string;
  genderSought?: string;
  dateOfBirth?: string;
  locale?: string;
  consents?: { terms?: boolean; privacy?: boolean; marketing?: boolean };
};

const GENDERS = new Set(["woman", "man", "other"]);
const SOUGHT = new Set(["women", "men", "everyone"]);
const LOCALES = new Set(["nl", "fr", "en"]);

export async function POST(req: NextRequest) {
  logRequest(req, "/api/auth/register");
  const ip = clientIp(req) || "unknown";
  const limited = rateLimit(`register:${ip}`, 10, 60_000);
  if (!limited.allowed) {
    return jsonError(429, "rate_limited", "Too many registration attempts", {
      retryAfterSec: limited.retryAfterSec,
    });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return jsonError(400, "invalid_json", "Request body must be JSON");
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  const gender = body.gender || "";
  const genderSought = body.genderSought || "";
  const dateOfBirth = body.dateOfBirth || "";
  const locale = body.locale || "nl";
  const consents = body.consents || {};

  if (!email || !password || !gender || !genderSought || !dateOfBirth) {
    return jsonError(400, "validation_error", "Missing required fields");
  }
  if (!GENDERS.has(gender)) {
    return jsonError(400, "invalid_gender", "Invalid gender");
  }
  if (!SOUGHT.has(genderSought)) {
    return jsonError(400, "invalid_gender_sought", "Invalid genderSought");
  }
  if (!LOCALES.has(locale)) {
    return jsonError(400, "invalid_locale", "Invalid locale");
  }
  if (!consents.terms || !consents.privacy) {
    return jsonError(
      400,
      "consent_required",
      "Terms and privacy consent are required",
    );
  }
  if (!isAdult(dateOfBirth)) {
    return jsonError(
      400,
      "underage",
      "You must be at least 18 years old to register",
      { dateOfBirth },
    );
  }
  const pw = validatePassword(password, email);
  if (!pw.ok) {
    return jsonError(400, pw.code, pw.message);
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return jsonError(409, "email_taken", "Email already registered");
  }

  const passwordHash = await hashPassword(password);
  const { user } = await createUser({
    email,
    passwordHash,
    gender: gender as "woman" | "man" | "other",
    genderSought: genderSought as "women" | "men" | "everyone",
    dateOfBirth,
    locale: locale as "nl" | "fr" | "en",
    marketing: Boolean(consents.marketing),
    ip,
    userAgent: req.headers.get("user-agent"),
  });

  const verifyToken = await createToken(
    user.id,
    "email_verify",
    1000 * 60 * 60 * 48,
  );
  // Dev stub: no real mailer yet — token logged for QA.
  log.info("email_verify_stub", {
    userId: user.id,
    email: user.email,
    token: verifyToken.token,
    locale: user.locale,
  });

  const session = await issueAuthSession(user);
  await setSessionCookie(session.accessToken, session.expiresIn);

  return NextResponse.json(session, { status: 201 });
}
