"use client";

import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/coffee-data";
import type { Product } from "@/lib/store/types";
import { SectionHeading, easeOut } from "./motion-primitives";

export function MenuSection({
  products,
  onSelect,
  onAdd,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  const [active, setActive] = useState<string>("All");
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const visible = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <section id="menu" className="relative overflow-hidden bg-secondary/60 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          align="center"
          eyebrow="The menu"
          title="Brewed by category"
          copy="Filter your way through signatures, cold brews, espresso, bakery and beans for home."
        />

        <div
          role="tablist"
          aria-label="Menu categories"
          className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2"
        >
          {categories.map((c) => {
            const isActive = active === c;
            return (
              <motion.button
                key={c}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(c)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="menu-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-primary"
                  />
                )}
                <span className="relative z-10">{c}</span>
              </motion.button>
            );
          })}
        </div>

        <motion.ul layout className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 22 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -14 }}
                transition={{ duration: 0.45, ease: easeOut }}
              >
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="group flex h-full gap-4 rounded-3xl border border-border/60 bg-card p-4 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <button
                    onClick={() => onSelect(p)}
                    aria-label={`View ${p.name}`}
                    className="shrink-0 overflow-hidden rounded-2xl"
                  >
                    <motion.img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={768}
                      height={880}
                      className="size-28 object-cover sm:size-32"
                      whileHover={{ scale: 1.12, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 240, damping: 24 }}
                    />
                  </button>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="eyebrow">{p.category}</p>
                    <h3 className="mt-1 truncate text-lg text-foreground">{p.name}</h3>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{p.notes ?? p.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="font-display text-base text-foreground">
                        {formatPrice(p.price)}
                      </span>
                      <motion.button
                        onClick={() => onAdd(p)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 420, damping: 18 }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground"
                      >
                        <Plus className="size-3.5" /> Add
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
