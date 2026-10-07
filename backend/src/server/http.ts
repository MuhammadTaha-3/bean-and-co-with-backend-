import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { connectDB } from "./db";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

type Ctx<P> = { params: Promise<P> };

/** Wraps a handler: connects to MongoDB, maps errors to JSON responses. */
export function route<P = Record<string, never>>(
  fn: (req: NextRequest, params: P) => Promise<Response>,
) {
  return async (req: NextRequest, ctx: Ctx<P>) => {
    try {
      await connectDB();
      return await fn(req, await ctx.params);
    } catch (e) {
      if (e instanceof HttpError)
        return NextResponse.json({ error: e.message }, { status: e.status });
      if (e instanceof ZodError)
        return NextResponse.json(
          { error: e.issues[0]?.message ?? "Invalid request" },
          { status: 400 },
        );
      console.error("[api]", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  };
}

export const ok = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const body = async (req: NextRequest) => {
  try {
    return (await req.json()) as unknown;
  } catch {
    throw new HttpError(400, "Invalid JSON body");
  }
};
export const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};
export const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
