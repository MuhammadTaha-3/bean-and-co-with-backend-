"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Heart, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "@/lib/coffee-data";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useAddToCart } from "@/lib/store/use-shop";
import { SectionHeading } from "@/components/coffee/motion-primitives";

export function WishlistView() {
  const wl = useWishlist();
  const addToCart = useAddToCart();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <SectionHeading eyebrow="Saved for later" title="Your wishlist" />
      {wl.items.length === 0 ? (
        <div className="mt-12 grid place-items-center rounded-4xl border border-dashed border-border py-20 text-center">
          <Heart className="size-10 text-accent" />
          <p className="mt-4 font-display text-xl">No favourites yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any drink to save it here.</p>
          <Link href="/products" className="btn-ember mt-6 rounded-full px-6 py-3 text-sm font-semibold">Browse the shop</Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {wl.items.map((i) => (
              <motion.li
                key={i.productId}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="overflow-hidden rounded-3xl border border-border/60 bg-card p-2 shadow-soft sm:rounded-4xl sm:p-3"
              >
                <div className="relative overflow-hidden rounded-3xl">
                  <Link href={`/products/${i.productId}`}>
                    <motion.img whileHover={{ scale: 1.08 }} src={i.image} alt={i.name} width={768} height={880} loading="lazy" className="aspect-[4/5] w-full object-cover sm:aspect-[5/6]" />
                  </Link>
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => wl.remove(i.productId)} aria-label={`Remove ${i.name}`} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-card/90 shadow-soft">
                    <X className="size-4" />
                  </motion.button>
                </div>
                <div className="px-1.5 pb-1.5 pt-3 sm:px-3 sm:pb-3 sm:pt-4">
                  <h3 className="line-clamp-2 text-base leading-snug sm:text-lg">{i.name}</h3>
                  <p className="text-sm text-muted-foreground">{formatPrice(i.price)}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (addToCart({ id: i.productId, name: i.name, price: i.price, image: i.image })) wl.remove(i.productId);
                    }}
                    className="btn-ember mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-2 py-2.5 text-xs font-semibold sm:mt-4 sm:py-3 sm:text-sm"
                  >
                    <ShoppingBag className="size-4" /> Move to cart
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
