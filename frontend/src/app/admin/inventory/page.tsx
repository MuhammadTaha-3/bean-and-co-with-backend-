"use client";
import { useState } from "react";
import { toast } from "sonner";
import { updateStock } from "@/lib/store/repo";
import { stockState } from "@/lib/store/types";
import { useAdminData } from "@/lib/admin/use-admin-data";

const tone = {
  "in-stock": "bg-emerald-100 text-emerald-800",
  "low-stock": "bg-amber-100 text-amber-800",
  "out-of-stock": "bg-red-100 text-red-800",
};

export default function Inventory() {
  const { data, reload } = useAdminData();
  const [only, setOnly] = useState(false);
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const t = data.settings.lowStockThreshold;
  const rows = data.products.filter((p) => !only || stockState(p.stock, t) !== "in-stock");
  const set = async (id: string, n: number) => {
    try {
      await updateStock(id, n);
      toast.success("Stock updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update stock");
    }
    void reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Inventory</h1>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={only} onChange={(e) => setOnly(e.target.checked)} /> Low
          or out of stock only (≤ {t})
        </label>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="p-3">Product</th>
              <th>SKU</th>
              <th>State</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="text-muted-foreground">{p.sku ?? "—"}</td>
                <td>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs ${tone[stockState(p.stock, t)]}`}
                  >
                    {stockState(p.stock, t).replace("-", " ")}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <button
                      className="size-7 rounded-lg border border-input"
                      onClick={() => set(p.id, p.stock - 1)}
                    >
                      −
                    </button>
                    <input
                      key={p.stock}
                      type="number"
                      min="0"
                      defaultValue={p.stock}
                      className="w-16 rounded-lg border border-input bg-background px-2 py-1 text-center"
                      onBlur={(e) => {
                        const n = Number(e.target.value);
                        if (n !== p.stock && n >= 0) void set(p.id, n);
                      }}
                    />
                    <button
                      className="size-7 rounded-lg border border-input"
                      onClick={() => set(p.id, p.stock + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
