import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { Inventory, OrderModel, Product } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { HttpError, body, ok, route } from "@/server/http";
import { toOrder } from "@/server/serialize";
import { DEFAULT_SETTINGS, EXPRESS_FEE, FREE_DELIVERY_AT, PROMOS, unitPrice } from "@/lib/pricing";

export const GET = route(async (req) => {
  await requireAdmin(req);
  return ok(
    (await OrderModel.find().sort({ createdAt: -1 }).lean()).map((o) => toOrder(o as never)),
  );
});

const input = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        qty: z.number().int().min(1).max(99),
        size: z.string().optional(),
      }),
    )
    .min(1, "Your cart is empty"),
  promo: z.string().nullish(),
  deliveryMethod: z.enum(["standard", "express", "pickup"]),
  paymentMethod: z.enum(["cod", "card", "bank"]),
  address: z.object({
    fullName: z.string().trim().min(2),
    email: z.string().trim().email(),
    phone: z.string().trim().min(8),
    line1: z.string().trim().min(5),
    city: z.string().trim().min(2),
    postalCode: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  }),
});

// Unambiguous characters so the Tracking ID is easy to read out / type.
const newReference = () =>
  "BC-" + [...randomBytes(6)].map((b) => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[b % 31]).join("");

// Public: place an order. Prices, totals and stock are all decided here, never by the browser.
export const POST = route(async (req) => {
  const data = input.parse(await body(req));

  const ids = [...new Set(data.items.map((i) => i.productId))];
  const products = new Map(
    (await Product.find({ _id: { $in: ids }, status: "active" }).lean()).map((p) => [p._id, p]),
  );
  const lines = data.items.map((i) => {
    const p = products.get(i.productId);
    if (!p) throw new HttpError(409, "An item in your cart is no longer available");
    const price = unitPrice(p.price, i.size);
    return {
      productId: p._id,
      name: i.size ? `${p.name} (${i.size})` : p.name,
      price,
      image: p.image ?? "",
      qty: i.qty,
    };
  });

  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const pct = data.promo ? (PROMOS[data.promo.trim().toUpperCase()]?.pct ?? 0) : 0;
  const discount = Math.round((subtotal * pct) / 100);
  const deliveryFee =
    data.deliveryMethod === "pickup"
      ? 0
      : data.deliveryMethod === "express"
        ? EXPRESS_FEE
        : subtotal - discount >= FREE_DELIVERY_AT
          ? 0
          : DEFAULT_SETTINGS.deliveryFee;

  // Reserve stock atomically per product (works on a standalone MongoDB, no transactions needed).
  const need = new Map<string, number>();
  lines.forEach((l) => need.set(l.productId, (need.get(l.productId) ?? 0) + l.qty));
  const taken: [string, number][] = [];
  const rollback = () =>
    Promise.all(taken.map(([id, q]) => Inventory.updateOne({ _id: id }, { $inc: { stock: q } })));
  try {
    for (const [id, qty] of need) {
      // one atomic conditional update: it only applies if enough stock is left at that instant
      const res = await Inventory.updateOne(
        { _id: id, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
      );
      if (res.modifiedCount !== 1) {
        const name = products.get(id)?.name ?? "An item";
        const left = (await Inventory.findById(id).lean())?.stock ?? 0;
        throw new HttpError(
          409,
          left <= 0 ? `${name} just sold out` : `Only ${left} of ${name} left`,
        );
      }
      taken.push([id, qty]);
    }
    const now = new Date();
    const order = await OrderModel.create({
      _id: `ord-${randomUUID()}`,
      reference: newReference(),
      status: "Placed",
      history: [{ status: "Placed", at: now }],
      items: lines,
      subtotal,
      deliveryFee,
      discount,
      total: subtotal - discount + deliveryFee,
      address: data.address,
      paymentMethod: data.paymentMethod,
      deliveryMethod: data.deliveryMethod,
      customerEmail: data.address.email.toLowerCase(),
    });
    return ok(toOrder(order.toObject() as never), 201);
  } catch (e) {
    await rollback();
    throw e;
  }
});
