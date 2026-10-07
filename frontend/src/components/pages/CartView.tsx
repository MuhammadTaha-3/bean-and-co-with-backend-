"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BadgePercent, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/coffee-data";
import { PROMOS, keyOf, useCart } from "@/lib/store/cart-context";
import { useAddToCart, useCatalog } from "@/lib/store/use-shop";
import { AnimatedPrice, easeOut } from "@/components/coffee/motion-primitives";
import { QtyStepper } from "@/components/coffee/QtyStepper";
import { FreeDeliveryBar } from "@/components/coffee/FreeDeliveryBar";
import { inputClass } from "@/components/coffee/Field";

export function CartView() {
  const cart = useCart();
  const { products } = useCatalog();
  const addToCart = useAddToCart();
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const upsell = (products ?? [])
    .filter((p) => p.stock > 0 && !cart.lines.some((l) => l.productId === p.id))
    .slice(0, 3);

  const submitPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.applyPromo(code)) {
      toast.success("Promo code applied");
      setCode("");
      setCodeError("");
    } else setCodeError("That code isn't valid");
  };

  if (!cart.hydrated) return <div className="min-h-[50vh]" />;

  if (cart.lines.length === 0) {
    return (
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-md px-4 py-20 text-center">
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="mx-auto grid size-24 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="size-10 text-accent" />
        </motion.div>
        <h1 className="mt-8 text-4xl">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Nothing brewing yet. Pick something warm from the menu.</p>
        <Link href="/products" className="btn-ember mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold">
          Browse the shop <ArrowRight className="size-4" />
        </Link>
      </motion.section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-36 sm:px-6 lg:pb-24">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Review your order</p>
          <h1 className="mt-2 text-4xl sm:text-5xl">Your cart</h1>
        </div>
        <button
          onClick={() => {
            cart.clear();
            toast.message("Cart cleared");
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
        >
          <Trash2 className="size-4" /> Clear
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <ul>
            <AnimatePresence initial={false} mode="popLayout">
              {cart.lines.map((l) => {
                const key = keyOf(l);
                return (
                  <motion.li
                    key={key}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="mb-3 flex gap-3 rounded-3xl border border-border/60 bg-card p-3 shadow-soft sm:mb-4 sm:gap-4 sm:p-4"
                  >
                    <Link href={`/products/${l.productId}`} className="shrink-0 overflow-hidden rounded-2xl">
                      <motion.img whileHover={{ scale: 1.1 }} src={l.image} alt={l.name} width={768} height={880} className="size-20 object-cover sm:size-28" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={`/products/${l.productId}`} className="block truncate font-display text-base font-semibold sm:text-lg">
                            {l.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {l.size ? `${l.size} · ` : ""}
                            {formatPrice(l.price)} each
                          </p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          onClick={() => cart.remove(key)}
                          aria-label={`Remove ${l.name}`}
                          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                        >
                          <X className="size-4" />
                        </motion.button>
                      </div>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3 sm:pt-4">
                        <QtyStepper label={l.name} value={l.qty} max={l.stock ?? 99} onInc={() => cart.increment(key)} onDec={() => cart.decrement(key)} />
                        <AnimatedPrice value={l.price * l.qty} className="font-display text-lg" />
                      </div>
                      {l.stock !== undefined && l.qty >= l.stock && (
                        <p className="mt-2 text-xs font-medium text-accent">Maximum available quantity reached</p>
                      )}
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>

          <Link href="/products" className="mt-2 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline">
            ← Continue shopping
          </Link>

          {upsell.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl">Pair it with</h2>
              <ul className="mt-5 grid grid-cols-3 gap-2 sm:gap-4">
                {upsell.map((p, i) => (
                  <motion.li
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, ease: easeOut }}
                    className="rounded-2xl border border-border/60 bg-card p-2 sm:rounded-3xl sm:p-3"
                  >
                    <img src={p.image} alt={p.name} loading="lazy" width={768} height={880} className="aspect-square w-full rounded-2xl object-cover" />
                    <p className="mt-2 truncate text-xs font-semibold sm:mt-3 sm:text-sm">{p.name}</p>
                    <div className="mt-1 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-sm text-muted-foreground">{formatPrice(p.price)}</span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          cart.add(p, { stock: p.stock });
                          toast.success(`${p.name} added`);
                        }}
                        className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"
                      >
                        + Add
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="h-fit space-y-4 rounded-4xl border border-border/60 bg-card p-5 shadow-soft sm:p-6 lg:sticky lg:top-28">
          <h2 className="text-2xl">Order summary</h2>
          <FreeDeliveryBar />

          {cart.promo ? (
            <div className="flex items-center justify-between rounded-2xl bg-secondary px-4 py-3 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <BadgePercent className="size-4 text-accent" /> {cart.promo} · {PROMOS[cart.promo]?.label}
              </span>
              <button onClick={cart.clearPromo} aria-label="Remove promo code" className="text-muted-foreground hover:text-destructive">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={submitPromo}>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeError("");
                  }}
                  placeholder="Promo code (try BEAN10)"
                  aria-label="Promo code"
                  aria-invalid={!!codeError}
                  className={inputClass}
                />
                <button className="rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground">Apply</button>
              </div>
              {codeError && <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">{codeError}</p>}
            </form>
          )}

          <dl className="space-y-2.5 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={formatPrice(cart.subtotal)} />
            {cart.discount > 0 && <Row label="Discount" value={`− ${formatPrice(cart.discount)}`} />}
            <Row label="Delivery" value={cart.deliveryFee === 0 ? "Free" : formatPrice(cart.deliveryFee)} />
          </dl>
          <div className="flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-medium">Total</span>
            <AnimatedPrice value={cart.total} className="font-display text-3xl" />
          </div>
          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href="/checkout" className="btn-ember flex items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold">
              Proceed to checkout <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </aside>
      </div>

      {/* mobile sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <AnimatedPrice value={cart.total} className="font-display text-xl" />
          </div>
          <Link href="/checkout" className="btn-ember ml-auto max-w-[14rem] flex-1 rounded-full py-3.5 text-center text-sm font-semibold">
            Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
