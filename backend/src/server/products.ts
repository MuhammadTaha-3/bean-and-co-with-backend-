import { z } from "zod";
import { Category, Inventory, Product } from "./models";
import { toProduct } from "./serialize";

export const productInput = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]{0,80}$/, "Invalid product id")
    .optional(),
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().default(""),
  price: z.number().positive("Price must be above 0"),
  category: z.string().trim().min(1, "Category is required"),
  image: z.string().max(1_000_000).default(""),
  stock: z.number().int().min(0, "Stock can't be negative").optional(),
  status: z.enum(["active", "draft", "archived"]).default("active"),
  notes: z.string().optional(),
  roast: z.string().optional(),
  best: z.boolean().optional(),
  sku: z.string().optional(),
  discount: z.number().min(0).max(100).default(0),
  variants: z
    .array(z.object({ label: z.string().min(1), price: z.number().positive() }))
    .optional(),
});
export type ProductInput = z.infer<typeof productInput>;

const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "item";

/** Create-or-update. Stock is only written when supplied (new products start at 0), so editing
 *  a product's details can never overwrite stock that orders have changed in the meantime. */
export async function saveProductDoc(id: string, input: ProductInput) {
  const { id: _ignored, stock, ...fields } = input;
  void _ignored;
  await Category.updateOne(
    { name: input.category },
    { $setOnInsert: { name: input.category } },
    { upsert: true },
  );
  const doc = await Product.findByIdAndUpdate(
    id,
    { $set: fields },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).lean();
  const inv = await Inventory.findOneAndUpdate(
    { _id: id },
    stock === undefined ? { $setOnInsert: { stock: 0 } } : { $set: { stock } },
    { upsert: true, returnDocument: "after" },
  ).lean();
  return toProduct(doc as never, inv?.stock ?? 0);
}

export const createProduct = (input: ProductInput) =>
  saveProductDoc(
    input.id ?? `${slug(input.name)}-${Math.random().toString(36).slice(2, 7)}`,
    input,
  );
