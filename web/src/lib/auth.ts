import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  createSession,
  findUserById,
  type UserRecord,
} from "./db";
import { log } from "./logger";

const ACCESS_TTL_SEC = 60 * 60; // 1h
const COOKIE_NAME = "oprecht_session";

function getSecret(): Uint8Array {
  const raw =
    process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    "oprecht-m0-dev-secret-change-me";
  if (
    process.env.NODE_ENV === "production" &&
    raw === "oprecht-m0-dev-secret-change-me"
  ) {
    log.warn("auth_secret_default_in_production");
  }
  return new TextEncoder().encode(raw);
}

export type AccessClaims = {
  sub: string;
  email: string;
  sid: string;
};

export async function signAccessToken(
  user: UserRecord,
  sessionId: string,
): Promise<{ accessToken: string; expiresIn: number }> {
  const expiresIn = ACCESS_TTL_SEC;
  const accessToken = await new SignJWT({
    email: user.email,
    sid: sessionId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${expiresIn}s`)
    .sign(getSecret());
  return { accessToken, expiresIn };
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessClaims | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      sid: String(payload.sid || ""),
    };
  } catch {
    return null;
  }
}

export function toMe(user: UserRecord) {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    locale: user.locale,
    ...(user.firstName ? { firstName: user.firstName } : {}),
    onboarding: {
      quizComplete: false,
      profileComplete: false,
      searchCriteriaComplete: false,
      readyForSuggestions: false,
      profileCompletenessPercent: 0,
    },
    premium: { active: false },
    entitlements: {
      clearPhotos: false,
      messaging: false,
      likesVisitors: false,
      radiusSearch: false,
      continuousSuggestions: false,
    },
  };
}

export async function issueAuthSession(user: UserRecord) {
  const session = await createSession(user.id);
  const { accessToken, expiresIn } = await signAccessToken(user, session.id);
  return {
    accessToken,
    tokenType: "Bearer" as const,
    expiresIn,
    refreshToken: session.refreshToken,
    user: toMe(user),
  };
}

export function extractBearer(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header) return null;
  const m = /^Bearer\s+(.+)$/i.exec(header);
  return m?.[1] ?? null;
}

export async function getUserFromRequest(
  req: NextRequest,
): Promise<UserRecord | null> {
  const bearer = extractBearer(req);
  let token = bearer;
  if (!token) {
    const jar = await cookies();
    token = jar.get(COOKIE_NAME)?.value ?? null;
  }
  if (!token) return null;
  const claims = await verifyAccessToken(token);
  if (!claims) return null;
  return (await findUserById(claims.sub)) ?? null;
}

export async function setSessionCookie(accessToken: string, maxAge: number) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}


export { COOKIE_NAME, ACCESS_TTL_SEC };
