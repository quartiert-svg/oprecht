import { NextResponse } from "next/server";
import { log } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  log.info("health_check");
  return NextResponse.json({
    status: "ok",
    service: "oprecht-web",
    version: "0.1.0",
    time: new Date().toISOString(),
  });
}
