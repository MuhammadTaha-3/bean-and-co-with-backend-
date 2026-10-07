"use client";

import { AnimatePresence, motion } from "motion/react";
import { PackageOpen, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/coffee/ProductCard";
import { SectionHeading, easeOut } from "@/components/coffee/motion-primitives";
import { inputClass } from "@/components/coffee/Field";
import { useCatalog } from "@/lib/store/use-shop";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

export function ProductsView() {
  const { products, loading, error, retry } = useCatalog();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");

  const cats = useMemo(
    () => ["All", ...new Set((products ?? []).map((p) => p.category))],
    [products],
  );

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = (products ?? []).filter(
      (p) =>
        (cat === "All" || p.category === cat) &&
        (!term || `${p.name} ${p.description} ${p.notes ?? ""}`.toLowerCase().includes(term)),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") sorted.sort((a, b) => Number(!!b.best) - Number(!!a.best));
    return sorted;
  }, [products, q, cat, sort]);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <SectionHeading
        eyebrow="The shop"
        title="Everything we pour, bake and roast"
        copy="Search the full range, filter by category and sort by price."
      />

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search latte, beans, tiramisu…"
            aria-label="Search products"
            className={`${inputClass} pl-11 pr-10`}
          />
          <AnimatePresence>
            {q && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-secondary"
              >
                <X className="size-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort products"
          className={`${inputClass} lg:w-56`}
        >
          <option value="featured">Featured first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <div
        role="tablist"
        aria-label="Categories"
        className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {cats.map((c) => (
          <motion.button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            whileTap={{ scale: 0.95 }}
            className={`relative shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              cat === c ? "text-primary-foreground" : "text-foreground/70 hover:text-foreground"
            }`}
          >
            {cat === c && (
              <motion.span
                layoutId="shop-pill"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-primary"
              />
            )}
            <span className="relative z-10">{c}</span>
          </motion.button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {error
          ? "Couldn’t load products"
          : loading
            ? "Loading…"
            : `${visible.length} ${visible.length === 1 ? "item" : "items"}`}
      </p>

      {error ? (
        <div
          role="alert"
          className="mt-4 rounded-3xl border border-border bg-secondary/50 px-6 py-10 text-center"
        >
          <p className="font-medium">We couldn’t load the menu.</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={retry}
            className="btn-ember mt-6 rounded-full px-6 py-3 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-3xl sm:h-[26rem] sm:rounded-4xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: easeOut }}
          className="mt-10 grid place-items-center rounded-4xl border border-dashed border-border py-20 text-center"
        >
          <PackageOpen className="size-10 text-accent" />
          <p className="mt-4 font-display text-xl">Nothing matches that</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different word or clear the filters.
          </p>
          <button
            onClick={() => {
              setQ("");
              setCat("All");
            }}
            className="btn-ember mt-6 rounded-full px-6 py-3 text-sm font-semibold"
          >
            Reset filters
          </button>
        </motion.div>
      ) : (
        <motion.ul layout className="mt-4 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </section>
  );
}
