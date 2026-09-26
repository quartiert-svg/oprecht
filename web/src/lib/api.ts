import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { log } from "./logger";

export function jsonError(
  status: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
) {
  return NextResponse.json(
    { code, message, ...(details ? { details } : {}) },
    { status },
  );
}

export function clientIp(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}

export function logRequest(
  req: Request,
  route: string,
  extra: Record<string, unknown> = {},
) {
  const ip = clientIp(req);
  log.info("http_request", {
    route,
    method: req.method,
    ipHash: ip
      ? createHash("sha256").update(ip).digest("hex").slice(0, 16)
      : null,
    ...extra,
  });
}
