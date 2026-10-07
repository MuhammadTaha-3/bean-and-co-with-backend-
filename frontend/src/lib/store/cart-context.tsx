"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_SETTINGS, FREE_DELIVERY_AT, PROMOS } from "@/lib/pricing";
import type { CartLine, Product } from "./types";

const CART_KEY = "bc2_cart";
const PROMO_KEY = "bc2_promo";

/** Shared with the server so the cart preview and the real order total always agree. */
export { FREE_DELIVERY_AT, PROMOS };

export const lineKey = (productId: string, size?: string) => `${productId}::${size ?? ""}`;
export const keyOf = (l: Pick<CartLine, "productId" | "size">) => lineKey(l.productId, l.size);

type AddOptions = { qty?: number; size?: string; price?: number; stock?: number };

type CartContextValue = {
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  promo: string | null;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (product: Pick<Product, "id" | "name" | "price" | "image">, opts?: AddOptions) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const cap = (line: CartLine, qty: number) => Math.min(line.stock ?? 99, 99, qty);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [promo, setPromo] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const deliveryBase = DEFAULT_SETTINGS.deliveryFee;

  // hydrate after mount so SSR markup matches
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
      const p = window.localStorage.getItem(PROMO_KEY);
      if (p && PROMOS[p]) setPromo(p);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
      if (promo) window.localStorage.setItem(PROMO_KEY, promo);
      else window.localStorage.removeItem(PROMO_KEY);
    } catch {
      /* ignore */
    }
  }, [lines, promo, hydrated]);

  // keep the cart in sync across browser tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY && e.newValue) {
        try {
          setLines(JSON.parse(e.newValue) as CartLine[]);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback<CartContextValue["add"]>((product, opts = {}) => {
    const { qty = 1, size, price = product.price, stock } = opts;
    const key = lineKey(product.id, size);
    setLines((prev) => {
      const found = prev.find((l) => keyOf(l) === key);
      if (found) {
        return prev.map((l) =>
          keyOf(l) === key
            ? { ...l, stock: stock ?? l.stock, qty: cap({ ...l, stock: stock ?? l.stock }, l.qty + qty) }
            : l,
        );
      }
      const line: CartLine = {
        productId: product.id,
        name: product.name,
        price,
        image: product.image,
        size,
        stock,
        qty: 0,
      };
      return [...prev, { ...line, qty: Math.max(1, cap(line, qty)) }];
    });
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => keyOf(l) !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => keyOf(l) !== key)
        : prev.map((l) => (keyOf(l) === key ? { ...l, qty: cap(l, qty) } : l)),
    );
  }, []);

  const increment = useCallback((key: string) => {
    setLines((prev) => prev.map((l) => (keyOf(l) === key ? { ...l, qty: cap(l, l.qty + 1) } : l)));
  }, []);

  const decrement = useCallback((key: string) => {
    setLines((prev) =>
      prev.flatMap((l) => (keyOf(l) !== key ? [l] : l.qty <= 1 ? [] : [{ ...l, qty: l.qty - 1 }])),
    );
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setPromo(null);
  }, []);

  const applyPromo = useCallback((code: string) => {
    const c = code.trim().toUpperCase();
    if (!PROMOS[c]) return false;
    setPromo(c);
    return true;
  }, []);

  const clearPromo = useCallback(() => setPromo(null), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const pct = promo ? (PROMOS[promo]?.pct ?? 0) : 0;
    const discount = Math.round((subtotal * pct) / 100);
    const after = subtotal - discount;
    const deliveryFee = lines.length === 0 || after >= FREE_DELIVERY_AT ? 0 : deliveryBase;
    return {
      lines,
      hydrated,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      discount,
      deliveryFee,
      total: after + deliveryFee,
      promo,
      applyPromo,
      clearPromo,
      open,
      setOpen,
      add,
      remove,
      setQty,
      increment,
      decrement,
      clear,
    };
  }, [lines, hydrated, promo, open, deliveryBase, applyPromo, clearPromo, add, remove, setQty, increment, decrement, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
