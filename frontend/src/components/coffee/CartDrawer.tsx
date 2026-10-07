"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { formatPrice } from "@/lib/coffee-data";
import { keyOf, useCart } from "@/lib/store/cart-context";
import { AnimatedPrice, easeOut } from "./motion-primitives";
import { QtyStepper } from "./QtyStepper";
import { FreeDeliveryBar } from "./FreeDeliveryBar";

export function CartDrawer() {
  const cart = useCart();
  const { open, setOpen, lines } = cart;
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button aria-label="Close cart" onClick={close} className="absolute inset-0 bg-espresso/50 backdrop-blur-sm" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-lift"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-5 sm:px-6">
              <h2 className="flex items-center gap-2 font-display text-xl">
                <ShoppingBag className="size-5 text-accent" /> Your cart
                {cart.count > 0 && (
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 font-sans text-xs font-semibold">
                    {cart.count}
                  </span>
                )}
              </h2>
              <motion.button
                onClick={close}
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close cart"
                className="grid size-9 place-items-center rounded-full border border-border"
              >
                <X className="size-4" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              {lines.length > 0 && (
                <div className="mb-5">
                  <FreeDeliveryBar />
                </div>
              )}
              <AnimatePresence initial={false} mode="popLayout">
                {lines.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center"
                  >
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="grid size-20 place-items-center rounded-full bg-secondary"
                    >
                      <ShoppingBag className="size-8 text-accent" />
                    </motion.div>
                    <p className="font-display text-xl">Nothing brewing yet</p>
                    <p className="max-w-[16rem] text-sm text-muted-foreground">
                      Add a cup from the menu and it will wait for you here.
                    </p>
                    <Link
                      href="/products"
                      onClick={close}
                      className="btn-ember rounded-full px-6 py-3 text-sm font-semibold"
                    >
                      Browse the menu
                    </Link>
                  </motion.div>
                ) : (
                  lines.map((l) => {
                    const key = keyOf(l);
                    return (
                      <motion.div
                        key={key}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className="mb-4 flex items-center gap-3 rounded-3xl border border-border/60 p-3"
                      >
                        <img src={l.image} alt={l.name} loading="lazy" width={768} height={880} className="size-16 shrink-0 rounded-2xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{l.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {l.size ? `${l.size} · ` : ""}
                            {formatPrice(l.price)}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <QtyStepper
                              compact
                              label={l.name}
                              value={l.qty}
                              max={l.stock ?? 99}
                              onInc={() => cart.increment(key)}
                              onDec={() => cart.decrement(key)}
                            />
                            <span className="text-sm font-semibold">{formatPrice(l.price * l.qty)}</span>
                          </div>
                        </div>
                        <motion.button
                          onClick={() => cart.remove(key)}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          aria-label={`Remove ${l.name}`}
                          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </motion.button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence initial={false}>
              {lines.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-6">
                    {cart.discount > 0 && (
                      <div className="mb-1 flex justify-between text-sm text-muted-foreground">
                        <span>Discount ({cart.promo})</span>
                        <span>− {formatPrice(cart.discount)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Subtotal</span>
                      <AnimatedPrice value={cart.subtotal - cart.discount} className="font-display text-2xl" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Delivery calculated at checkout.</p>
                    <div className="mt-4 grid grid-cols-[1fr_1.4fr] gap-2">
                      <Link
                        href="/cart"
                        onClick={close}
                        className="rounded-full border border-border py-3.5 text-center text-sm font-semibold transition-colors hover:bg-secondary"
                      >
                        View cart
                      </Link>
                      <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.97 }}>
                        <Link href="/checkout" onClick={close} className="btn-ember block rounded-full py-3.5 text-center text-sm font-semibold">
                          Checkout
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
