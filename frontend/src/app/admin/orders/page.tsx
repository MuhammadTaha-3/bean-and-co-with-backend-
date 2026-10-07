"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusTimeline } from "@/components/admin/StatusTimeline";
import { formatPrice } from "@/lib/coffee-data";
import { updateOrderStatus } from "@/lib/store/repo";
import { ORDER_FLOW, type Order, type OrderStatus } from "@/lib/store/types";
import { statusTone, useAdminData } from "@/lib/admin/use-admin-data";

export default function Orders() {
  const { data, reload } = useAdminData();
  const [q, setQ] = useState("");
  const [st, setSt] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const rows = data.orders.filter(
    (o) =>
      (st === "all" || o.status === st) &&
      (o.reference + o.address.fullName + o.customerEmail).toLowerCase().includes(q.toLowerCase()),
  );
  const open = data.orders.find((o) => o.id === openId) ?? null;
  const change = async (o: Order, s: OrderStatus) => {
    try {
      await updateOrderStatus(o.id, s);
      toast.success(`${o.reference} → ${s}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't update status");
    }
    void reload();
  };
  const next =
    open && open.status !== "Cancelled"
      ? ORDER_FLOW[ORDER_FLOW.indexOf(open.status as (typeof ORDER_FLOW)[number]) + 1]
      : undefined;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Orders</h1>
      <div className="flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search ID, name or email"
          className="rounded-xl border border-input bg-card px-3 py-2 text-sm"
        />
        <select
          value={st}
          onChange={(e) => setSt(e.target.value)}
          className="rounded-xl border border-input bg-card px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {[...ORDER_FLOW, "Cancelled"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-2xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="p-3">Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr
                key={o.id}
                onClick={() => setOpenId(o.id)}
                className="cursor-pointer border-t border-border hover:bg-secondary/40"
              >
                <td className="p-3 font-medium">{o.reference}</td>
                <td>{o.address.fullName}</td>
                <td>{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                <td>{formatPrice(o.total)}</td>
                <td>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusTone(o.status)}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No orders match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle>Order {open.reference}</DialogTitle>
              </DialogHeader>
              <div className="rounded-xl bg-secondary/60 p-3 text-sm">
                <p className="font-medium">{open.address.fullName}</p>
                <p className="text-muted-foreground">
                  {open.customerEmail} · {open.address.phone}
                </p>
                <p className="text-muted-foreground">
                  {open.address.line1}, {open.address.city}
                </p>
                <p className="mt-1 capitalize text-muted-foreground">
                  {open.deliveryMethod} · {open.paymentMethod}
                </p>
              </div>
              <ul className="space-y-1 text-sm">
                {open.items.map((i) => (
                  <li key={i.productId + i.name} className="flex justify-between">
                    <span>
                      {i.qty} × {i.name}
                    </span>
                    <span>{formatPrice(i.price * i.qty)}</span>
                  </li>
                ))}
                <li className="flex justify-between border-t border-border pt-1 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(open.total)}</span>
                </li>
              </ul>
              <StatusTimeline order={open} />
              <div className="flex flex-wrap gap-2">
                {next && (
                  <button
                    onClick={() => change(open, next)}
                    className="btn-ember rounded-full px-5 py-2 text-sm font-semibold"
                  >
                    Mark {next}
                  </button>
                )}
                <select
                  value={open.status}
                  onChange={(e) => change(open, e.target.value as OrderStatus)}
                  className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  {[...ORDER_FLOW, "Cancelled"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
