// Client-side data access: every function is a call to the Next.js API (MongoDB is the single
// source of truth). Nothing here persists product, stock or order data in the browser.
import { DEFAULT_SETTINGS } from "@/lib/pricing";
import type { Order, OrderStatus, Product, StoreSettings } from "./types";

export { DEFAULT_SETTINGS };

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function api<T>(path: string, init?: { method?: string; json?: unknown }): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: init?.method ?? "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
    ...(init?.json !== undefined
      ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(init.json) }
      : {}),
  });
  const data = (await res.json().catch(() => null)) as { error?: unknown } | null;
  if (!res.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`;
    throw new ApiError(res.status, message);
  }
  return data as T;
}

// Last-seen stock per product, so add-to-cart can warn instantly. The server re-checks at checkout.
const stockSeen = new Map<string, number>();
const remember = (list: Product[]) => list.forEach((p) => stockSeen.set(p.id, p.stock));
export const getStockSync = (id: string): number | null => stockSeen.get(id) ?? null;

/* ------------------------------ products ------------------------------ */

/** Storefront catalogue: active products only. */
export async function listProducts(): Promise<Product[]> {
  const list = await api<Product[]>("/products");
  remember(list);
  return list;
}
/** Admin: every product regardless of status (requires the admin session). */
export const listAllProducts = () => api<Product[]>("/products?all=1");

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const p = await api<Product>(`/products/${encodeURIComponent(id)}`);
    remember([p]);
    return p;
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 401)) return null;
    throw e;
  }
}

/** Pass `original` when editing: stock is only sent if the admin actually changed it. */
export const saveProduct = (input: Product, original?: Product | null) => {
  const { stock, ...rest } = input;
  return api<Product>(`/products/${encodeURIComponent(input.id)}`, {
    method: "PUT",
    json: original && original.stock === stock ? rest : input,
  });
};

export const deleteProduct = (id: string) =>
  api<unknown>(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });

export const updateStock = (id: string, stock: number) =>
  api<unknown>(`/inventory/${encodeURIComponent(id)}`, {
    method: "PATCH",
    json: { stock: Math.max(0, Math.round(stock)) },
  });

/* ----------------------------- categories ----------------------------- */

export const listCategories = () => api<string[]>("/categories");
export const addCategory = (name: string) =>
  api<unknown>("/categories", { method: "POST", json: { name } });
export const renameCategory = (from: string, to: string) =>
  api<unknown>(`/categories/${encodeURIComponent(from)}`, { method: "PUT", json: { name: to } });
export const deleteCategory = (name: string) =>
  api<unknown>(`/categories/${encodeURIComponent(name)}`, { method: "DELETE" });

/* ------------------------------- orders ------------------------------- */

export type NewOrder = {
  items: { productId: string; qty: number; size?: string | undefined }[];
  promo?: string | null | undefined;
  deliveryMethod: Order["deliveryMethod"];
  paymentMethod: Order["paymentMethod"];
  address: Order["address"];
};

/** Admin: all orders. */
export const listOrders = () => api<Order[]>("/orders");
/** Order-confirmation page (looked up by the order's private id). */
export async function getOrder(id: string): Promise<Order | null> {
  try {
    return await api<Order>(`/orders/${encodeURIComponent(id)}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}
export const createOrder = (input: NewOrder) =>
  api<Order>("/orders", { method: "POST", json: input });
export const updateOrderStatus = (id: string, status: OrderStatus) =>
  api<Order>(`/orders/${encodeURIComponent(id)}`, { method: "PATCH", json: { status } });

export type Tracking = Pick<Order, "reference" | "status" | "createdAt" | "history">;
/** Public tracking by Order/Tracking ID: status + timeline only. */
export async function trackOrder(ref: string): Promise<Tracking | null> {
  try {
    return await api<Tracking>(`/track/${encodeURIComponent(ref.trim())}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

/* -------------------------------- settings ------------------------------- */

export const getSettings = async (): Promise<StoreSettings> => DEFAULT_SETTINGS;
export const readSettingsSync = (): StoreSettings => DEFAULT_SETTINGS;
