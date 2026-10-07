import { z } from "zod";
import { Category, Product } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { HttpError, body, decode, ok, route } from "@/server/http";

type P = { name: string };

export const PUT = route<P>(async (req, { name }) => {
  await requireAdmin(req);
  const from = decode(name);
  const { name: to } = z.object({ name: z.string().trim().min(1) }).parse(await body(req));
  if (to !== from && (await Category.exists({ name: to })))
    throw new HttpError(409, "That category already exists");
  if (!(await Category.exists({ name: from }))) throw new HttpError(404, "Category not found");
  await Category.updateOne({ name: from }, { $set: { name: to } });
  await Product.updateMany({ category: from }, { $set: { category: to } });
  return ok({ name: to });
});

export const DELETE = route<P>(async (req, { name }) => {
  await requireAdmin(req);
  const n = decode(name);
  if (await Product.exists({ category: n }))
    throw new HttpError(409, "Move or delete its products first");
  await Category.deleteOne({ name: n });
  return ok({ ok: true });
});
