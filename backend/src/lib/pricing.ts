// Shared by the storefront (cart display) and the server (authoritative order totals).
import type { StoreSettings } from "./types";

export const FREE_DELIVERY_AT = 6000;
export const EXPRESS_FEE = 450;

export const PROMOS: Record<string, { label: string; pct: number }> = {
  BEAN10: { label: "10% off your order", pct: 10 },
  WELCOME15: { label: "15% off your first order", pct: 15 },
};

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Bean & Co",
  currency: "PKR",
  lowStockThreshold: 10,
  deliveryFee: 250,
  supportEmail: "hello@beanandco.pk",
};

export const SIZES = ["Small", "Regular", "Large"] as const;
export const sizeMultiplier = (size?: string) =>
  size === "Small" ? 0.85 : size === "Large" ? 1.25 : 1;
export const unitPrice = (base: number, size?: string) => Math.round(base * sizeMultiplier(size));
