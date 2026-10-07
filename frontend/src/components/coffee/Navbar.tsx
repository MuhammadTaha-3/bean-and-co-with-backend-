"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, Heart, Menu as MenuIcon, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";

const links = [
  { label: "Home", hash: "home" },
  { label: "Menu", hash: "menu" },
  { label: "Best Selling", hash: "best" },
  { label: "Iced", hash: "iced" },
  { label: "Story", hash: "story" },
  { label: "Reviews", hash: "reviews" },
  { label: "Contact", hash: "contact" },
];

function Badge({ n }: { n: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [1.5, 1], opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground"
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

const iconBtn =
  "relative grid size-10 place-items-center rounded-full border border-border/70 bg-card text-foreground/70";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const cart = useCart();
  const wishlist = useWishlist();
  const router = useRouter();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border px-4 py-3 transition-all duration-500 sm:px-5 ${
          scrolled
            ? "border-border/70 bg-card/85 shadow-soft backdrop-blur-xl"
            : "border-transparent bg-card/40 backdrop-blur-md"
        }`}
      >
        <Link href="/#home" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <motion.span
            whileHover={{ rotate: -14, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 350 }}
          >
            <Coffee className="size-5 text-accent" />
          </motion.span>
          Bean &amp; Co
        </Link>

        <ul className="hidden items-center gap-1 rounded-full bg-primary px-2 py-1.5 lg:flex">
          {links.map((l) => (
            <li key={l.hash}>
              <Link
                href={`/#${l.hash}`}
                className="relative block rounded-full px-3.5 py-1.5 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <motion.button
            onClick={() => router.push("/products")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Search the menu"
            className={iconBtn}
          >
            <Search className="size-4" />
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="hidden sm:block"
          >
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlist.count} items`}
              className={iconBtn}
            >
              <Heart className="size-4" />
              <Badge n={wishlist.count} />
            </Link>
          </motion.div>
          <motion.button
            onClick={() => cart.setOpen(true)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label={`Cart, ${cart.count} items`}
            className={iconBtn}
          >
            <ShoppingBag className="size-4" />
            <Badge n={cart.count} />
          </motion.button>
          <motion.button
            onClick={() => setOpen((v) => !v)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
            aria-expanded={open}
            className={`${iconBtn} lg:hidden`}
          >
            {open ? <X className="size-4" /> : <MenuIcon className="size-4" />}
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-lift backdrop-blur-xl lg:hidden"
          >
            <ul className="p-3">
              {links.map((l, i) => (
                <motion.li
                  key={l.hash}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    href={`/#${l.hash}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base text-foreground transition-colors hover:bg-secondary"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/wishlist"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-base hover:bg-secondary"
                >
                  Wishlist {wishlist.count > 0 && `(${wishlist.count})`}
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
