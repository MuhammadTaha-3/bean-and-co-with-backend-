"use client";

import { motion } from "motion/react";
import { Coffee, Instagram, Twitter, Youtube } from "lucide-react";

const columns = [
  { title: "Drink", items: ["Signatures", "Cold brew", "Espresso", "Bakery"] },
  { title: "Company", items: ["Our story", "Roastery tours", "Wholesale", "Careers"] },
  { title: "Support", items: ["Shipping", "Bean club", "Contact", "FAQ"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/70">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <a href="/#home" className="inline-flex items-center gap-2 font-display text-xl">
              <Coffee className="size-5 text-accent" /> Bean &amp; Co
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Small-batch coffee roasted in Accra and served with unreasonable care since 1978.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="grid size-10 place-items-center rounded-full border border-border bg-card text-foreground/70"
                >
                  <Icon className="size-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="eyebrow">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.items.map((i) => (
                    <li key={i}>
                      <a
                        href="/#menu"
                        className="text-sm text-muted-foreground transition-colors hover:text-accent"
                      >
                        {i}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bean &amp; Co Roasters. All rights reserved.</p>
          <p>Brewed with care in Accra, Ghana.</p>
        </div>
      </div>
    </footer>
  );
}
