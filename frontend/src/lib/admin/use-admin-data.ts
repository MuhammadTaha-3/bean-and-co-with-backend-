"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ApiError,
  listAllProducts,
  listCategories,
  listOrders,
  getSettings,
} from "@/lib/store/repo";
import type { Order, Product, StoreSettings } from "@/lib/store/types";

export function useAdminData() {
  const [data, setData] = useState<{
    products: Product[];
    orders: Order[];
    categories: string[];
    settings: StoreSettings;
  } | null>(null);
  const reload = useCallback(async () => {
    try {
      const [products, orders, categories, settings] = await Promise.all([
        listAllProducts(),
        listOrders(),
        listCategories(),
        getSettings(),
      ]);
      setData({ products, orders, categories, settings });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) window.location.href = "/admin/login";
      else toast.error(e instanceof Error ? e.message : "Couldn't load data");
    }
  }, []);
  useEffect(() => {
    void reload();
  }, [reload]);
  return { data, reload };
}

export const statusTone = (s: string) =>
  s === "Delivered"
    ? "bg-emerald-100 text-emerald-800"
    : s === "Cancelled"
      ? "bg-red-100 text-red-800"
      : s === "Placed"
        ? "bg-amber-100 text-amber-800"
        : "bg-sky-100 text-sky-800";
