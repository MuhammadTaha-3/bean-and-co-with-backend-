import { Inventory, Product } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { ok, body, route } from "@/server/http";
import { toProduct } from "@/server/serialize";
import { createProduct, productInput } from "@/server/products";

// Public: active products only. Admin (`?all=1` + session): every status.
export const GET = route(async (req) => {
  const all = req.nextUrl.searchParams.get("all") === "1";
  if (all) await requireAdmin(req);
  const docs = await Product.find(all ? {} : { status: "active" })
    .sort({ createdAt: -1 })
    .lean();
  const inv = await Inventory.find({ _id: { $in: docs.map((d) => d._id) } }).lean();
  const stock = new Map(inv.map((i) => [i._id, i.stock]));
  return ok(docs.map((d) => toProduct(d as never, stock.get(d._id) ?? 0)));
});

export const POST = route(async (req) => {
  await requireAdmin(req);
  return ok(await createProduct(productInput.parse(await body(req))), 201);
});
