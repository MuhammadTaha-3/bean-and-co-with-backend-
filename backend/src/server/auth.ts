import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { Admin } from "./models";
import { HttpError } from "./http";

export const COOKIE = "bc_admin";
const WEEK = 7 * 24 * 3600;

const secret = () => {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET must be set (16+ chars, see .env.example)");
  return s;
};
const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("base64url");

export const adminEmail = () => (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

export function makeToken(email: string) {
  const body = Buffer.from(
    JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + WEEK }),
  ).toString("base64url");
  return `${body}.${sign(body)}`;
}
export const cookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: WEEK,
});

/** Returns the admin email if the request carries a valid session cookie, else null. */
export async function getAdmin(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(COOKIE)?.value;
  const [body, sig] = token?.split(".") ?? [];
  if (!body || !sig) return null;
  const good = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (good.length !== given.length || !timingSafeEqual(good, given)) return null;
  try {
    const { email, exp } = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      email: string;
      exp: number;
    };
    if (exp < Date.now() / 1000) return null;
    return (await Admin.exists({ email })) ? email : null; // revoking an Admin doc ends their session
  } catch {
    return null;
  }
}

export async function requireAdmin(req: NextRequest) {
  const email = await getAdmin(req);
  if (!email) throw new HttpError(401, "Admin login required");
  return email;
}
