import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/server/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({
      ok: true,
      service: "bean-and-co",
      db: mongoose.connection.readyState === 1 ? "connected" : "down",
    });
  } catch (e) {
    const reason = e instanceof Error ? e.message.split("\n")[0] : "unknown";
    return NextResponse.json({ ok: false, db: "unreachable", reason }, { status: 503 });
  }
}
