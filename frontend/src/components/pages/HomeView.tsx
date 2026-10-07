"use client";

import { useCallback, useState } from "react";
import { Hero } from "@/components/coffee/Hero";
import { BestSellers } from "@/components/coffee/BestSellers";
import { IcedCoffee } from "@/components/coffee/IcedCoffee";
import { MenuSection } from "@/components/coffee/MenuSection";
import { ProductDialog, type DialogProduct } from "@/components/coffee/ProductDialog";
import { Story } from "@/components/coffee/Story";
import { Reviews, Contact } from "@/components/coffee/Reviews";
import { useAddToCart, useCatalog } from "@/lib/store/use-shop";

export function HomeView() {
  const [selected, setSelected] = useState<DialogProduct | null>(null);
  const addToCart = useAddToCart();
  const products = useCatalog().products ?? [];
  const close = useCallback(() => setSelected(null), []);

  return (
    <>
      <Hero products={products} onSelect={setSelected} />
      <BestSellers products={products} onSelect={setSelected} onAdd={(p) => addToCart(p)} />
      <IcedCoffee products={products} onSelect={setSelected} onAdd={(p) => addToCart(p)} />
      <MenuSection products={products} onSelect={setSelected} onAdd={(p) => addToCart(p)} />
      <Story />
      <Reviews />
      <Contact />

      <ProductDialog
        product={selected}
        onClose={close}
        onAdd={(p, opts) => {
          if (addToCart(p, opts)) setSelected(null);
        }}
      />
    </>
  );
}
