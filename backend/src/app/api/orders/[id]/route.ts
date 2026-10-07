import { z } from "zod";
import { Inventory, OrderModel } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { HttpError, body, decode, ok, route } from "@/server/http";
import { toOrder } from "@/server/serialize";
import { ORDER_FLOW } from "@/lib/types";

type P = { id: string };

// Public: used by the order-confirmation page. The id is an unguessable UUID.
export const GET = route<P>(async (_req, { id }) => {
  const o = await OrderModel.findById(decode(id)).lean();
  if (!o) throw new HttpError(404, "Order not found");
  return ok(toOrder(o as never));
});

// Admin: update status. Cancelling returns the stock; a cancelled or delivered order is final.
export const PATCH = route<P>(async (req, { id }) => {
  await requireAdmin(req);
  const { status } = z
    .object({ status: z.enum([...ORDER_FLOW, "Cancelled"]) })
    .parse(await body(req));
  const o = await OrderModel.findById(decode(id));
  if (!o) throw new HttpError(404, "Order not found");
  if (o.status === status) return ok(toOrder(o.toObject() as never));
  if (o.status === "Cancelled") throw new HttpError(409, "A cancelled order can't be reopened");
  if (o.status === "Delivered" && status === "Cancelled")
    throw new HttpError(409, "A delivered order can't be cancelled");

  // guard on the old status so two admins can't both cancel (and double-restock) the same order
  const updated = await OrderModel.findOneAndUpdate(
    { _id: o._id, status: o.status },
    { $set: { status }, $push: { history: { status, at: new Date() } } },
    { returnDocument: "after" },
  );
  if (!updated) throw new HttpError(409, "Order was just changed by someone else — refresh");
  if (status === "Cancelled")
    await Promise.all(
      o.items.map((i: { productId?: string | null; qty?: number | null }) =>
        Inventory.updateOne({ _id: i.productId ?? "" }, { $inc: { stock: i.qty ?? 0 } }),
      ),
    );
  return ok(toOrder(updated.toObject() as never));
});
