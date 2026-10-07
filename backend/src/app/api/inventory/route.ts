import { Inventory } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { ok, route } from "@/server/http";

export const GET = route(async (req) => {
  await requireAdmin(req);
  return ok((await Inventory.find().lean()).map((i) => ({ productId: i._id, stock: i.stock })));
});
