"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard, StockBadge } from "@/components/coffee/ProductCard";
import { QtyStepper } from "@/components/coffee/QtyStepper";
import { AnimatedPrice, easeOut } from "@/components/coffee/motion-primitives";
import { getProduct } from "@/lib/store/repo";
import { useAddToCart, useCatalog } from "@/lib/store/use-shop";
import { useWishlist } from "@/lib/store/wishlist-context";
import type { Product } from "@/lib/store/types";

const sizes = [
  { label: "Small", mult: 0.85 },
  { label: "Regular", mult: 1 },
  { label: "Large", mult: 1.25 },
] as const;

export function ProductDetailView({ id }: { id: string }) {
    const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [size, setSize] = useState<(typeof sizes)[number]>(sizes[1]);
  const [qty, setQty] = useState(1);
  const { products } = useCatalog();
  const addToCart = useAddToCart();
  const wishlist = useWishlist();

  useEffect(() => {
    setProduct(undefined);
    setQty(1);
    setSize(sizes[1]);
    getProduct(id).then(setProduct);
  }, [id]);

  if (product === undefined) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2">
        <Skeleton className="aspect-[5/6] rounded-4xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (product === null || product.status === "archived") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-4xl">Product not found</h1>
        <p className="mt-3 text-muted-foreground">That item may have been removed from the menu.</p>
        <Link href="/products" className="btn-ember mt-8 inline-block rounded-full px-7 py-3.5 text-sm font-semibold">
          Back to shop
        </Link>
      </div>
    );
  }

  const isBeans = product.category === "Beans" || product.category === "Bakery";
  const unit = isBeans ? product.price : Math.round(product.price * size.mult);
  const soldOut = product.stock <= 0;
  const saved = wishlist.has(product.id);
  const related = (products ?? []).filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
        <ArrowLeft className="size-4" /> All products
      </Link>

      <div className="mt-6 grid gap-6 md:grid-cols-2 md:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="overflow-hidden rounded-4xl bg-secondary shadow-lift"
        >
          <motion.img
            src={product.image}
            alt={product.name}
            width={768}
            height={880}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.9, ease: easeOut }}
            className="aspect-square w-full object-cover sm:aspect-[5/6]"
          />
        </motion.div>

        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="flex flex-col">
          {[
            <div key="a" className="flex items-center gap-3">
              <p className="eyebrow">
                {product.category}
                {product.roast ? ` · ${product.roast}` : ""}
              </p>
              <StockBadge stock={product.stock} />
            </div>,
            <h1 key="b" className="mt-3 text-4xl leading-tight sm:text-5xl">{product.name}</h1>,
            <p key="c" className="mt-2 text-sm font-medium text-accent">{product.notes}</p>,
            <p key="d" className="mt-5 max-w-md leading-relaxed text-muted-foreground">{product.description}</p>,
          ].map((n, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
              {n}
            </motion.div>
          ))}

          {!isBeans && (
            <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="mt-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Size</p>
              <div className="mt-2 flex gap-2">
                {sizes.map((s) => (
                  <motion.button
                    key={s.label}
                    onClick={() => setSize(s)}
                    whileTap={{ scale: 0.94 }}
                    className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${size.label === s.label ? "text-primary-foreground" : "border border-border text-foreground/70"}`}
                  >
                    {size.label === s.label && (
                      <motion.span layoutId="detail-size" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <span className="relative z-10">{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="mt-7 flex items-center gap-5">
            <QtyStepper label={product.name} value={qty} min={1} max={Math.max(1, Math.min(9, product.stock))} onInc={() => setQty((q) => q + 1)} onDec={() => setQty((q) => q - 1)} />
            <AnimatedPrice value={unit * qty} className="font-display text-3xl" />
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }} className="mt-8 flex gap-3">
            <motion.button
              onClick={() => addToCart(product, { qty, ...(isBeans ? {} : { size: size.label }), price: unit })}
              disabled={soldOut}
              whileHover={soldOut ? {} : { scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="btn-ember inline-flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold disabled:opacity-50"
            >
              <ShoppingBag className="size-4" /> {soldOut ? "Sold out" : "Add to cart"}
            </motion.button>
            <motion.button
              onClick={() => wishlist.toggle(product)}
              whileTap={{ scale: 0.88 }}
              aria-pressed={saved}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              className="grid size-14 place-items-center rounded-full border border-border bg-card"
            >
              <Heart className={`size-5 ${saved ? "fill-accent text-accent" : ""}`} />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 sm:mt-24">
          <h2 className="text-3xl">You might also like</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
