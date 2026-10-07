"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/store/cart-context";
import { WishlistProvider } from "@/lib/store/wishlist-context";
import { SiteLayout } from "@/components/coffee/SiteLayout";
import { CartDrawer } from "@/components/coffee/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

/** All client-side providers + the storefront chrome (navbar, footer, cart drawer). */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <SiteLayout>{children}</SiteLayout>
        <CartDrawer />
        <Toaster position="top-center" />
      </WishlistProvider>
    </CartProvider>
  );
}
