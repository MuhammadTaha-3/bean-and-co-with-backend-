import { z } from "zod";
import { Inventory, Product } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { HttpError, body, decode, ok, route } from "@/server/http";

// Admin manual stock update: set an absolute level ({stock}) or adjust ({delta}, never below 0).
export const PATCH = route<{ id: string }>(async (req, { id }) => {
  await requireAdmin(req);
  const pid = decode(id);
  if (!(await Product.exists({ _id: pid }))) throw new HttpError(404, "Product not found");
  const input = z
    .union([z.object({ stock: z.number().int().min(0) }), z.object({ delta: z.number().int() })])
    .parse(await body(req));
  let doc;
  if ("stock" in input)
    doc = await Inventory.findByIdAndUpdate(
      pid,
      { $set: { stock: input.stock } },
      { upsert: true, returnDocument: "after" },
    );
  else {
    const res = await Inventory.updateOne(
      { _id: pid, stock: { $gte: -input.delta } },
      { $inc: { stock: input.delta } },
    );
    if (res.modifiedCount !== 1 && input.delta !== 0)
      throw new HttpError(409, "Stock can't go below 0");
    doc = await Inventory.findById(pid);
    if (!doc) throw new HttpError(404, "Product not found");
  }
  return ok({ productId: pid, stock: doc.stock });
});
