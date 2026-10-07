"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { formatPrice } from "@/lib/coffee-data";
import { stockState, type Product } from "@/lib/store/types";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useAddToCart } from "@/lib/store/use-shop";
import { easeOut } from "./motion-primitives";

export function StockBadge({ stock, threshold = 10 }: { stock: number; threshold?: number }) {
  const s = stockState(stock, threshold);
  const map = {
    "in-stock": ["In stock", "bg-secondary text-foreground/70"],
    "low-stock": [`Only ${stock} left`, "bg-accent/15 text-accent"],
    "out-of-stock": ["Sold out", "bg-destructive/10 text-destructive"],
  } as const;
  const [label, cls] = map[s];
  return <span className={`rounded-full px-2 py-0.5 text-[10px] sm:px-3 sm:py-1 sm:text-[11px] font-semibold ${cls}`}>{label}</span>;
}

export function ProductCard({ product: p }: { product: Product }) {
  const wishlist = useWishlist();
  const addToCart = useAddToCart();
  const saved = wishlist.has(p.id);
  const soldOut = p.stock <= 0;

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/60 bg-card p-2 shadow-soft transition-shadow hover:shadow-lift sm:rounded-4xl sm:p-3"
    >
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <Link href={`/products/${p.id}`} aria-label={`View ${p.name}`}>
          <motion.img
            src={p.image}
            alt={p.name}
            loading="lazy"
            width={768}
            height={880}
            className={`aspect-[4/5] w-full object-cover sm:aspect-[5/6] ${soldOut ? "grayscale-[0.6]" : ""}`}
            whileHover={{ scale: 1.08, rotate: -1.5 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          />
        </Link>
        <motion.button
          onClick={() => wishlist.toggle(p)}
          whileTap={{ scale: 0.8 }}
          aria-label={saved ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          aria-pressed={saved}
          className="absolute right-2 top-2 grid size-8 sm:right-3 sm:top-3 sm:size-9 place-items-center rounded-full bg-card/90 shadow-soft backdrop-blur"
        >
          <motion.span key={String(saved)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }}>
            <Heart className={`size-4 ${saved ? "fill-accent text-accent" : "text-foreground/70"}`} />
          </motion.span>
        </motion.button>
        <span className="absolute left-2 top-2 sm:left-3 sm:top-3">
          <StockBadge stock={p.stock} />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3 sm:px-3 sm:pb-3 sm:pt-5">
        <p className="eyebrow">{p.category}</p>
        <Link href={`/products/${p.id}`} className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug text-foreground sm:mt-1.5 sm:text-xl">
          {p.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:text-sm">{p.notes ?? p.description}</p>
        <div className="mt-3 flex items-center justify-between gap-2 sm:mt-5">
          <span className="font-display text-base text-foreground sm:text-lg">{formatPrice(p.price)}</span>
          <motion.button
            onClick={() => addToCart(p)}
            disabled={soldOut}
            whileHover={soldOut ? {} : { scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 420, damping: 18 }}
            aria-label={soldOut ? `${p.name} is sold out` : `Add ${p.name} to cart`}
            className="grid size-9 shrink-0 place-items-center sm:size-11 rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Plus className="size-4 sm:size-5" />
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
export const gridItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};
