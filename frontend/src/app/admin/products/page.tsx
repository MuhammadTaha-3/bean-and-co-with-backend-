"use client";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "@/components/admin/ProductForm";
import { formatPrice } from "@/lib/coffee-data";
import { deleteProduct } from "@/lib/store/repo";
import type { Product } from "@/lib/store/types";
import { useAdminData } from "@/lib/admin/use-admin-data";

export default function Products() {
  const { data, reload } = useAdminData();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const rows = data.products.filter(
    (p) =>
      (cat === "all" || p.category === cat) &&
      (p.name + (p.sku ?? "")).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Products</h1>
        <button
          onClick={() => setEditing("new")}
          className="btn-ember flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          <Plus className="size-4" /> Add product
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or SKU"
          className="rounded-xl border border-input bg-card px-3 py-2 text-sm"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-xl border border-input bg-card px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {data.categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="p-3">Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="size-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sku ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td>{p.category}</td>
                <td>
                  {p.discount ? (
                    <>
                      <span className="mr-1 text-muted-foreground line-through">
                        {formatPrice(p.price)}
                      </span>
                      {formatPrice(p.price * (1 - p.discount / 100))}
                    </>
                  ) : (
                    formatPrice(p.price)
                  )}
                </td>
                <td>{p.stock}</td>
                <td className="capitalize">{p.status}</td>
                <td className="pr-3 text-right">
                  <button
                    aria-label="Edit"
                    onClick={() => setEditing(p)}
                    className="p-2 hover:text-ember"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    aria-label="Delete"
                    onClick={async () => {
                      if (confirm(`Delete ${p.name}?`)) {
                        try {
                          await deleteProduct(p.id);
                          toast.success("Product deleted");
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Couldn't delete");
                        }
                        void reload();
                      }
                    }}
                    className="p-2 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No products match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "New product" : "Edit product"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProductForm
              product={editing === "new" ? null : editing}
              categories={data.categories}
              onDone={() => {
                setEditing(null);
                void reload();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
