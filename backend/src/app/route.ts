import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "bean-and-co-backend",
    message: "Backend API is running.",
    health: "/api/health",
  });
}
