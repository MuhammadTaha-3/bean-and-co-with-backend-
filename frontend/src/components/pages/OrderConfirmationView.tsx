"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/coffee-data";
import { getOrder } from "@/lib/store/repo";
import type { Order } from "@/lib/store/types";

export function OrderConfirmationView({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  useEffect(() => {
    getOrder(id).then(setOrder);
  }, [id]);

  if (order === undefined) return <Skeleton className="mx-auto h-96 max-w-xl rounded-4xl" />;
  if (order === null)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-4xl">Order not found</h1>
        <Link
          href="/products"
          className="btn-ember mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-semibold"
        >
          Back to shop
        </Link>
      </div>
    );

  return (
    <section className="mx-auto max-w-xl px-4 pb-24 sm:px-6">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="mx-auto grid size-20 place-items-center rounded-full bg-accent text-accent-foreground shadow-lift"
        >
          <motion.span
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Check className="size-9" strokeWidth={3} />
          </motion.span>
        </motion.div>
        <h1 className="mt-6 text-4xl sm:text-5xl">
          Thank you, {order.address.fullName.split(" ")[0]}!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Order <span className="font-semibold text-foreground">{order.reference}</span> is
          confirmed. A receipt is on its way to {order.customerEmail}.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 rounded-4xl border border-border/60 bg-card p-4 shadow-soft sm:p-6"
      >
        <ul className="space-y-3">
          {order.items.map((i) => (
            <li key={i.productId + i.name} className="flex items-center gap-3">
              <img
                src={i.image}
                alt=""
                width={768}
                height={880}
                className="size-14 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{i.name}</p>
                <p className="text-xs text-muted-foreground">Qty {i.qty}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {!!order.discount && (
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Discount</dt>
              <dd>− {formatPrice(order.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Delivery</dt>
            <dd>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd className="font-display text-xl">{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-5 rounded-2xl bg-secondary/70 p-4 text-sm">
          <p className="font-semibold">Delivering to</p>
          <p className="mt-1 text-muted-foreground">
            {order.address.line1}, {order.address.city} · {order.address.phone}
          </p>
          <p className="mt-2 text-muted-foreground capitalize">
            {order.deliveryMethod} ·{" "}
            {order.paymentMethod === "cod" ? "Cash on delivery" : order.paymentMethod}
          </p>
        </div>
      </motion.div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/track-order?id=${order.reference}`}
          className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold"
        >
          Track order
        </Link>
        <Link href="/products" className="btn-ember rounded-full px-7 py-3.5 text-sm font-semibold">
          Keep shopping
        </Link>
      </div>
    </section>
  );
}
