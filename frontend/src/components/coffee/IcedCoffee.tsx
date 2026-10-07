"use client";

import { motion } from "motion/react";
import { Plus, Snowflake } from "lucide-react";
import { formatPrice } from "@/lib/coffee-data";
import type { Product } from "@/lib/store/types";
import { Reveal, fadeUp, stagger } from "./motion-primitives";

export function IcedCoffee({
  products,
  onSelect,
  onAdd,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  const icedDrinks = products.filter((p) => p.category === "Cold Brew").slice(0, 6);
  if (icedDrinks.length === 0) return null;
  return (
    <section id="iced" className="relative overflow-hidden bg-espresso py-20 sm:py-28">
      {/* drifting snowflake chill cues */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="absolute text-cream/10"
          style={{ left: `${8 + i * 16}%`, top: `${((i * 37) % 80) + 5}%` }}
          animate={{ y: [0, -18, 0], rotate: [0, 180, 360], opacity: [0.08, 0.2, 0.08] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        >
          <Snowflake className="size-6" />
        </motion.span>
      ))}

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <p className="eyebrow !text-cream/60">Ice cold</p>
          <h2 className="mt-3 text-4xl leading-[1.05] text-cream sm:text-5xl">
            Cold coffee, <span className="italic text-caramel">seriously chilled</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-cream/70">
            Brewed hot, flash-chilled, never watered down. Built for Karachi afternoons.
          </p>
        </Reveal>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger(0.12)}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {icedDrinks.map((p) => (
            <motion.li key={p.id} variants={fadeUp}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group overflow-hidden rounded-3xl bg-cream/5 shadow-soft ring-1 ring-cream/10 backdrop-blur-sm"
              >
                <button onClick={() => onSelect(p)} className="block w-full text-left">
                  <div className="overflow-hidden">
                    <motion.img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      width={768}
                      height={880}
                      className="aspect-[4/5] w-full object-cover"
                      whileHover={{ scale: 1.07 }}
                      transition={{ type: "spring", stiffness: 240, damping: 24 }}
                    />
                  </div>
                  <div className="p-5 pb-0">
                    <p className="eyebrow !text-caramel">{p.notes ?? p.roast}</p>
                    <h3 className="mt-1.5 text-xl text-cream">{p.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cream/65">
                      {p.description}
                    </p>
                  </div>
                </button>
                <div className="flex items-center justify-between p-5">
                  <p className="font-display text-lg text-cream">{formatPrice(p.price)}</p>
                  <motion.button
                    onClick={() => onAdd(p)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.94 }}
                    aria-label={`Add ${p.name} to cart`}
                    className="btn-ember inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold"
                  >
                    <Plus className="size-4" /> Add
                  </motion.button>
                </div>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
