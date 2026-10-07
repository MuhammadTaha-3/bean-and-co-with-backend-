"use client";

import { motion } from "motion/react";
import { Plus, Star } from "lucide-react";
import { formatPrice } from "@/lib/coffee-data";
import type { Product } from "@/lib/store/types";
import { Reveal, SectionHeading, easeOut } from "./motion-primitives";

export function BestSellers({
  products,
  onSelect,
  onAdd,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
  onAdd: (p: Product) => void;
}) {
  const bestSellers = products.filter((p) => p.best);
  if (bestSellers.length === 0) return null;
  return (
    <section id="best" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Crowd favourites"
            title="The cups people come back for"
            copy="Three brews carry half our counter. Pulled, poured and finished by hand every single morning."
          />
          <Reveal delay={0.15}>
            <a
              href="#menu"
              className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
            >
              See the full menu
            </a>
          </Reveal>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {bestSellers.map((p) => (
            <motion.li
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 34 },
                show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
              }}
            >
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-4xl border border-border/60 bg-card p-3 shadow-soft transition-shadow hover:shadow-lift"
              >
                <button
                  onClick={() => onSelect(p)}
                  className="relative overflow-hidden rounded-3xl"
                  aria-label={`View ${p.name}`}
                >
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={768}
                    height={880}
                    className="aspect-[5/6] w-full object-cover"
                    whileHover={{ scale: 1.09, rotate: -1.5 }}
                    transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1 text-[11px] font-semibold text-foreground backdrop-blur">
                    {p.roast}
                  </span>
                </button>

                <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
                  <div className="flex items-center gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <h3 className="mt-2 text-xl text-foreground">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.notes}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-display text-lg text-foreground">
                      {formatPrice(p.price)}
                    </span>
                    <motion.button
                      onClick={() => onAdd(p)}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: "spring", stiffness: 420, damping: 18 }}
                      aria-label={`Add ${p.name} to cart`}
                      className="grid size-11 place-items-center rounded-full bg-primary text-primary-foreground"
                    >
                      <Plus className="size-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
