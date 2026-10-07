import { OrderModel } from "@/server/models";
import { HttpError, decode, ok, route } from "@/server/http";

// Public tracking: status and timeline only — no address, phone or email.
export const GET = route<{ ref: string }>(async (_req, { ref }) => {
  const o = await OrderModel.findOne({ reference: decode(ref).trim().toUpperCase() }).lean();
  if (!o) throw new HttpError(404, "Order not found");
  return ok({
    reference: o.reference,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    history: (o.history ?? []).map((h: { status?: string | null; at?: Date | null }) => ({
      status: h.status,
      at: new Date(h.at ?? o.createdAt).toISOString(),
    })),
  });
});
