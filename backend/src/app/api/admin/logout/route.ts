import { COOKIE } from "@/server/auth";
import { ok, route } from "@/server/http";

export const POST = route(async () => {
  const res = ok({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
});
