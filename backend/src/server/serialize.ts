import type { Order, Product } from "@/lib/types";
import type { OrderDoc, ProductDoc } from "./models";

export function toProduct(p: ProductDoc, stock: number): Product {
  return {
    id: p._id,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    category: p.category,
    image: p.image ?? "",
    stock,
    status: p.status,
    notes: p.notes ?? undefined,
    roast: p.roast ?? undefined,
    best: p.best ?? undefined,
    sku: p.sku ?? undefined,
    discount: p.discount ?? 0,
    variants: p.variants?.length
      ? p.variants.map((v) => ({ label: v.label ?? "", price: v.price ?? 0 }))
      : undefined,
    createdAt: p.createdAt?.toISOString(),
  };
}

export function toOrder(o: OrderDoc): Order {
  return {
    id: o._id,
    reference: o.reference,
    createdAt: o.createdAt.toISOString(),
    status: o.status as Order["status"],
    items: (o.items ?? []).map((i) => ({
      productId: i.productId ?? "",
      name: i.name ?? "",
      price: i.price ?? 0,
      image: i.image ?? "",
      qty: i.qty ?? 0,
    })),
    subtotal: o.subtotal ?? 0,
    deliveryFee: o.deliveryFee ?? 0,
    discount: o.discount ?? 0,
    total: o.total ?? 0,
    address: {
      fullName: o.address?.fullName ?? "",
      phone: o.address?.phone ?? "",
      email: o.address?.email ?? "",
      line1: o.address?.line1 ?? "",
      city: o.address?.city ?? "",
      ...(o.address?.postalCode ? { postalCode: o.address.postalCode } : {}),
      ...(o.address?.notes ? { notes: o.address.notes } : {}),
    },
    paymentMethod: o.paymentMethod as Order["paymentMethod"],
    deliveryMethod: o.deliveryMethod as Order["deliveryMethod"],
    customerEmail: o.customerEmail ?? "",
    history: (o.history ?? []).map((h) => ({
      status: h.status as Order["status"],
      at: (h.at ?? o.createdAt).toISOString(),
    })),
  };
}
