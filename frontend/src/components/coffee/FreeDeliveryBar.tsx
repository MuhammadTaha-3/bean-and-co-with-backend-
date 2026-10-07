"use client";

import { motion } from "motion/react";
import { Truck } from "lucide-react";
import { formatPrice } from "@/lib/coffee-data";
import { FREE_DELIVERY_AT, useCart } from "@/lib/store/cart-context";

export function FreeDeliveryBar() {
  const { subtotal, discount, lines } = useCart();
  if (lines.length === 0) return null;
  const net = subtotal - discount;
  const left = Math.max(0, FREE_DELIVERY_AT - net);
  const pct = Math.min(100, (net / FREE_DELIVERY_AT) * 100);
  return (
    <div className="rounded-2xl bg-secondary/70 p-3.5">
      <p className="flex items-center gap-2 text-xs font-medium text-foreground">
        <Truck className="size-4 text-accent" />
        {left === 0
          ? "You've unlocked free delivery 🎉"
          : `Add ${formatPrice(left)} more for free delivery`}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
