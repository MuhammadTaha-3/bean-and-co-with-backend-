"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Heart, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/coffee-data";
import { useWishlist } from "@/lib/store/wishlist-context";

export type DialogProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  roast?: string | undefined;
};

const sizes = ["Small", "Regular", "Large"] as const;

export function ProductDialog({
  product,
  onClose,
  onAdd,
}: {
  product: DialogProduct | null;
  onClose: () => void;
  onAdd: (p: DialogProduct, opts: { qty: number; size: string; price: number }) => void;
}) {
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<(typeof sizes)[number]>("Regular");

  useEffect(() => {
    if (product) {
      setQty(1);
      setSize("Regular");
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  const multiplier = size === "Small" ? 0.85 : size === "Large" ? 1.25 : 1;
  const unit = product ? Math.round(product.price * multiplier) : 0;
  const saved = product ? wishlist.has(product.id) : false;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-espresso/50 backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product.name}
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-4xl bg-card shadow-lift sm:rounded-4xl"
          >
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close product details"
              className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-card/90 text-foreground shadow-soft backdrop-blur"
            >
              <X className="size-4" />
            </motion.button>

            <div className="grid sm:grid-cols-2">
              <div className="overflow-hidden bg-secondary">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  width={768}
                  height={880}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="h-56 w-full object-cover sm:h-full"
                />
              </div>

              <motion.div
                className="p-6 sm:p-8"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } } }}
              >
                {[
                  <p key="c" className="eyebrow">
                    {product.category} · {product.roast}
                  </p>,
                  <h3 key="t" className="mt-2 text-3xl text-foreground">
                    {product.name}
                  </h3>,
                  <p key="d" className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>,
                ].map((node, i) => (
                  <motion.div
                    key={i}
                    variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                  >
                    {node}
                  </motion.div>
                ))}

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                  className="mt-6"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Size
                  </p>
                  <div className="mt-2 flex gap-2">
                    {sizes.map((s) => (
                      <motion.button
                        key={s}
                        onClick={() => setSize(s)}
                        whileTap={{ scale: 0.94 }}
                        className={`relative rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                          size === s
                            ? "text-primary-foreground"
                            : "border border-border text-foreground/70"
                        }`}
                      >
                        {size === s && (
                          <motion.span
                            layoutId="size-pill"
                            className="absolute inset-0 rounded-full bg-primary"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{s}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                  className="mt-6 flex items-center gap-4"
                >
                  <div className="flex items-center gap-1 rounded-full border border-border p-1">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                    >
                      <Minus className="size-3.5" />
                    </motion.button>
                    <motion.span key={qty} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-7 text-center text-sm font-semibold">
                      {qty}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setQty((q) => Math.min(9, q + 1))}
                      aria-label="Increase quantity"
                      className="grid size-8 place-items-center rounded-full hover:bg-secondary"
                    >
                      <Plus className="size-3.5" />
                    </motion.button>
                  </div>
                  <span className="font-display text-2xl text-foreground">
                    {formatPrice(unit * qty)}
                  </span>
                </motion.div>

                <motion.button
                  variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                  onClick={() => onAdd(product, { qty, size, price: unit })}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="btn-ember mt-7 w-full rounded-full py-3.5 text-sm font-semibold"
                >
                  Add to cart
                </motion.button>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <button
                    onClick={() => wishlist.toggle(product)}
                    aria-pressed={saved}
                    className="inline-flex items-center gap-1.5 font-medium text-foreground/70 transition-colors hover:text-accent"
                  >
                    <Heart className={`size-4 ${saved ? "fill-accent text-accent" : ""}`} />
                    {saved ? "Saved" : "Save for later"}
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    Full details
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
