import { getAdmin } from "@/server/auth";
import { ok, route } from "@/server/http";

export const GET = route(async (req) => {
  const email = await getAdmin(req);
  return ok({ admin: !!email, email });
});
