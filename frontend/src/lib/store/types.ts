// Shared data shapes for the storefront + admin portal.
// These match what a future API (Next-style route handlers + database) would return,
// so swapping localStorage for fetch() only touches src/lib/store/repo.ts.

export type ProductStatus = "active" | "draft" | "archived";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  status: ProductStatus;
  notes?: string | undefined;
  roast?: string | undefined;
  best?: boolean | undefined;
  createdAt?: string | undefined;
  sku?: string | undefined;
  /** percent off, 0-100 (admin-managed) */
  discount?: number | undefined;
  variants?: { label: string; price: number }[] | undefined;
};

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string | undefined;
  stock?: number | undefined;
  qty: number;
};

export type WishlistItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
};

export type Address = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  city: string;
  postalCode?: string;
  notes?: string;
};

export const ORDER_FLOW = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
] as const;
export type OrderStatus = (typeof ORDER_FLOW)[number] | "Cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export type Order = {
  id: string;
  reference: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount?: number | undefined;
  total: number;
  address: Address;
  paymentMethod: "cod" | "card" | "bank";
  deliveryMethod: "standard" | "express" | "pickup";
  customerEmail: string;
  history?: { status: OrderStatus; at: string }[] | undefined;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  createdAt: string;
};

export type StoreSettings = {
  storeName: string;
  currency: string;
  lowStockThreshold: number;
  deliveryFee: number;
  supportEmail: string;
};

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

export const stockState = (stock: number, threshold: number): StockState =>
  stock <= 0 ? "out-of-stock" : stock <= threshold ? "low-stock" : "in-stock";
