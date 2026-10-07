"use client";
import { useState } from "react";
import { toast } from "sonner";
import { addCategory, deleteCategory, renameCategory } from "@/lib/store/repo";
import { useAdminData } from "@/lib/admin/use-admin-data";

export default function Categories() {
  const { data, reload } = useAdminData();
  const [name, setName] = useState("");
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const count = (c: string) => data.products.filter((p) => p.category === c).length;

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="font-display text-3xl">Categories</h1>
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) return;
          try {
            await addCategory(n);
            setName("");
            toast.success("Category added");
            void reload();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Couldn't add category");
          }
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="flex-1 rounded-xl border border-input bg-card px-3 py-2 text-sm"
        />
        <button className="btn-ember rounded-full px-5 py-2 text-sm font-semibold">Add</button>
      </form>
      <ul className="divide-y divide-border rounded-2xl bg-card shadow-soft">
        {data.categories.map((c) => (
          <li key={c} className="flex items-center gap-3 p-3 text-sm">
            <span className="flex-1 font-medium">{c}</span>
            <span className="text-muted-foreground">{count(c)} products</span>
            <button
              className="hover:text-ember"
              onClick={async () => {
                const to = prompt("Rename category", c)?.trim();
                if (!to || to === c) return;
                try {
                  await renameCategory(c, to);
                  toast.success("Renamed");
                  void reload();
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Couldn't rename");
                }
              }}
            >
              Rename
            </button>
            <button
              className="hover:text-destructive"
              onClick={async () => {
                if (count(c) > 0) {
                  toast.error("Move or delete its products first");
                  return;
                }
                try {
                  await deleteCategory(c);
                  toast.success("Category deleted");
                  void reload();
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Couldn't delete");
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
