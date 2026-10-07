"use client";
import { useState } from "react";
import { toast } from "sonner";
import { saveProduct } from "@/lib/store/repo";
import type { Product } from "@/lib/store/types";

const cls =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const slug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function ProductForm({
  product,
  categories,
  onDone,
}: {
  product: Product | null;
  categories: string[];
  onDone: () => void;
}) {
  const [f, setF] = useState({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    category: product?.category ?? categories[0] ?? "",
    price: String(product?.price ?? ""),
    discount: String(product?.discount ?? 0),
    stock: String(product?.stock ?? 0),
    status: product?.status ?? "active",
    image: product?.image ?? "",
    description: product?.description ?? "",
    notes: product?.notes ?? "",
    roast: product?.roast ?? "",
    variants: (product?.variants ?? []).map((v) => `${v.label}:${v.price}`).join("\n"),
  });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) =>
    setF({ ...f, [k]: e.target.value });

  const upload = (file?: File) => {
    if (!file) return;
    if (file.size > 600_000) {
      toast.error("Image is over 600 KB. Use a smaller one or paste a URL.");
      return;
    }
    const r = new FileReader();
    r.onload = () => setF((p) => ({ ...p, image: String(r.result) }));
    r.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(f.price),
      discount = Number(f.discount),
      stock = Number(f.stock);
    if (!f.name.trim() || !f.category || !(price > 0)) {
      toast.error("Name, category and a price above 0 are required");
      return;
    }
    if (discount < 0 || discount > 100 || stock < 0) {
      toast.error("Check discount (0–100) and stock");
      return;
    }
    const variants = f.variants
      .split("\n")
      .map((l) => l.split(":"))
      .filter((p) => p[0]?.trim() && Number(p[1]) > 0)
      .map((p) => ({ label: p[0]!.trim(), price: Number(p[1]) }));
    try {
      await saveProduct(
        {
          ...(product ?? {}),
          id: product?.id ?? slug(f.name) + "-" + Date.now().toString(36),
          name: f.name.trim(),
          description: f.description.trim(),
          price,
          category: f.category,
          image: f.image || "/images/p-beans.jpg",
          stock: Math.round(stock),
          status: f.status as Product["status"],
          notes: f.notes,
          roast: f.roast,
          sku: f.sku.trim() || undefined,
          discount,
          variants,
        },
        product,
      );
      toast.success(product ? "Product updated" : "Product created");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save product");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <label className="sm:col-span-2 text-sm">
        Name
        <input className={cls} value={f.name} onChange={set("name")} />
      </label>
      <label className="text-sm">
        SKU
        <input className={cls} value={f.sku} onChange={set("sku")} />
      </label>
      <label className="text-sm">
        Category
        <select className={cls} value={f.category} onChange={set("category")}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Price (PKR)
        <input type="number" min="0" className={cls} value={f.price} onChange={set("price")} />
      </label>
      <label className="text-sm">
        Discount %
        <input
          type="number"
          min="0"
          max="100"
          className={cls}
          value={f.discount}
          onChange={set("discount")}
        />
      </label>
      <label className="text-sm">
        Stock
        <input type="number" min="0" className={cls} value={f.stock} onChange={set("stock")} />
      </label>
      <label className="text-sm">
        Status
        <select className={cls} value={f.status} onChange={set("status")}>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <div className="sm:col-span-2 flex items-center gap-3">
        {f.image && <img src={f.image} alt="" className="size-14 rounded-xl object-cover" />}
        <input
          className={cls}
          placeholder="Image URL or /images/…"
          value={f.image}
          onChange={set("image")}
        />
        <input
          type="file"
          accept="image/*"
          className="w-40 text-xs"
          onChange={(e) => upload(e.target.files?.[0])}
        />
      </div>
      <label className="sm:col-span-2 text-sm">
        Description
        <textarea rows={3} className={cls} value={f.description} onChange={set("description")} />
      </label>
      <label className="text-sm">
        Tasting notes
        <input className={cls} value={f.notes} onChange={set("notes")} />
      </label>
      <label className="text-sm">
        Roast
        <input className={cls} value={f.roast} onChange={set("roast")} />
      </label>
      <label className="sm:col-span-2 text-sm">
        Variants, one per line as <code>Label:Price</code>
        <textarea
          rows={2}
          className={cls}
          value={f.variants}
          onChange={set("variants")}
          placeholder={"250g:2800\n1kg:9500"}
        />
      </label>
      <button className="btn-ember sm:col-span-2 rounded-full px-6 py-3 text-sm font-semibold">
        {product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
