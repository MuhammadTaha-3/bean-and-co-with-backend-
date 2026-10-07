import { z } from "zod";
import { Admin } from "@/server/models";
import { COOKIE, adminEmail, cookieOptions, makeToken } from "@/server/auth";
import { HttpError, body, ok, route } from "@/server/http";

export const POST = route(async (req) => {
  const { email } = z
    .object({ email: z.string().trim().toLowerCase().email() })
    .parse(await body(req));
  const allowed = adminEmail();
  if (!allowed || email !== allowed)
    throw new HttpError(403, "This email isn't authorized for admin access.");
  await Admin.updateOne({ email }, { $setOnInsert: { email } }, { upsert: true });
  const res = ok({ email });
  res.cookies.set(COOKIE, makeToken(email), cookieOptions());
  return res;
});
