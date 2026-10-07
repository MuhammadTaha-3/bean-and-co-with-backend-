import { Inventory, Product } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { HttpError, body, decode, ok, route } from "@/server/http";
import { toProduct } from "@/server/serialize";
import { productInput, saveProductDoc } from "@/server/products";

type P = { id: string };

export const GET = route<P>(async (req, { id }) => {
  const doc = await Product.findById(decode(id)).lean();
  if (!doc) throw new HttpError(404, "Product not found");
  if (doc.status !== "active") await requireAdmin(req); // drafts/archived are admin-only
  const inv = await Inventory.findById(doc._id).lean();
  return ok(toProduct(doc as never, inv?.stock ?? 0));
});

export const PUT = route<P>(async (req, { id }) => {
  await requireAdmin(req);
  return ok(await saveProductDoc(decode(id), productInput.parse(await body(req))));
});

export const DELETE = route<P>(async (req, { id }) => {
  await requireAdmin(req);
  const pid = decode(id);
  await Promise.all([Product.deleteOne({ _id: pid }), Inventory.deleteOne({ _id: pid })]);
  return ok({ ok: true });
});
