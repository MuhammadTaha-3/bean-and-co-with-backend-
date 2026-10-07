"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Star } from "lucide-react";
import { useRef } from "react";
const cup = "/images/hero-cup-glass.png";
const splash = "/images/splash.png";
import { FloatingBeans, Steam } from "./FloatingBeans";
import { formatPrice } from "@/lib/coffee-data";
import type { Product } from "@/lib/store/types";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({
  products,
  onSelect,
}: {
  products: Product[];
  onSelect: (p: Product) => void;
}) {
  const bestSellers = products.filter((p) => p.best).slice(0, 3);
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cupY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const splashY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const cupScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);

  return (
    <section id="home" ref={ref} className="surface-hero relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">
      <FloatingBeans />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-6">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.09 } } }}>
          <motion.p
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
            className="eyebrow"
          >
            Small-batch roastery · Est. 1978
          </motion.p>

          <motion.h1
            variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } } }}
            className="mt-4 text-5xl leading-[0.98] text-foreground sm:text-6xl lg:text-7xl"
          >
            Awaken Your
            <span className="block italic text-accent">Senses</span>
          </motion.h1>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } } }}
            className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground"
          >
            Because life is too short for bland coffee. Our brews are an invitation to taste, to
            feel, to linger a little longer.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="#menu"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="btn-ember group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
            >
              Order Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a
              href="#story"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center rounded-full border border-primary/25 bg-card px-7 py-3.5 text-sm font-semibold text-foreground"
            >
              Join Our Bean Club
            </motion.a>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            className="mt-9 flex items-center gap-4"
          >
            <div className="flex -space-x-3">
              {["A", "D", "L", "M", "K"].map((c, i) => (
                <motion.span
                  key={c}
                  whileHover={{ y: -5, scale: 1.12, zIndex: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="grid size-10 place-items-center rounded-full border-2 border-background bg-primary font-display text-sm text-primary-foreground"
                  style={{ opacity: 1 - i * 0.06 }}
                >
                  {c}
                </motion.span>
              ))}
              <span className="relative z-10 grid size-10 place-items-center rounded-full border-2 border-background bg-accent text-xs font-bold text-accent-foreground">
                40+
              </span>
            </div>
            <p className="max-w-[10rem] text-xs leading-snug text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="size-3.5 fill-accent text-accent" /> 4.9
              </span>
              <br />
              Happy customers recommend us
            </p>
          </motion.div>
        </motion.div>

        {/* Product visual */}
        <div className="relative mx-auto flex h-[380px] w-full max-w-xl items-center justify-center sm:h-[460px] lg:h-[560px]">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-[50%] bg-sand/70 blur-2xl"
            animate={reduce ? { scale: 1, opacity: 0.6 } : { scale: [1, 1.06, 1], opacity: [0.55, 0.8, 0.55] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div style={{ y: splashY }} className="absolute -inset-[18%]" aria-hidden="true">
            <motion.img
              src={splash}
              alt=""
              width={1408}
              height={1008}
              initial={{ opacity: 0, scale: 1.3, rotate: -14 }}
              animate={
                reduce
                  ? { opacity: 1, scale: 1.18, rotate: 0 }
                  : { opacity: 1, scale: [1.18, 1.26, 1.18], rotate: [0, 7, 0, -7, 0] }
              }
              transition={{
                opacity: { duration: 1.3, ease, delay: 0.15 },
                scale: reduce ? { duration: 1.3, ease, delay: 0.15 } : { duration: 16, repeat: Infinity, ease: "easeInOut" },
                rotate: reduce ? { duration: 1.3, ease, delay: 0.15 } : { duration: 22, repeat: Infinity, ease: "easeInOut" },
              }}
              className="h-full w-full object-contain will-change-transform"
            />
          </motion.div>
          <Steam className="absolute left-1/2 top-2 -translate-x-1/2" />
          <motion.img
            src={cup}
            alt="Bean & Co signature espresso in a transparent glass cup"
            width={1008}
            height={1200}
            style={{ y: cupY, scale: cupScale }}
            initial={{ opacity: 0, y: 60, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.1 }}
            whileHover={{ rotate: -3, scale: 1.05 }}
            className="relative z-10 h-[86%] object-contain drop-shadow-[0_40px_60px_oklch(0.3_0.06_45/0.35)] will-change-transform"
          />
        </div>
      </div>

      {/* Best selling strip */}
      <div className="relative mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="eyebrow"
        >
          Best Selling
        </motion.p>
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.75 } } }}
          className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:max-w-2xl"
        >
          {bestSellers.map((p) => (
            <motion.li
              key={p.id}
              variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
            >
              <motion.button
                onClick={() => onSelect(p)}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="group w-full text-left"
              >
                <div className="overflow-hidden rounded-3xl bg-card shadow-soft transition-shadow group-hover:shadow-lift">
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    width={768}
                    height={880}
                    className="aspect-[4/5] w-full object-cover"
                    whileHover={{ scale: 1.08, rotate: 1.5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                  />
                </div>
                <p className="mt-2.5 text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(p.price)}</p>
              </motion.button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
