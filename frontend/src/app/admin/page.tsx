"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPrice } from "@/lib/coffee-data";
import { stockState } from "@/lib/store/types";
import { statusTone, useAdminData } from "@/lib/admin/use-admin-data";

export default function Dashboard() {
  const { data } = useAdminData();
  if (!data) return <p className="text-muted-foreground">Loading…</p>;
  const { orders, products, settings } = data;
  const live = orders.filter((o) => o.status !== "Cancelled");
  const revenue = live.reduce((s, o) => s + o.total, 0);
  const low = products.filter(
    (p) => stockState(p.stock, settings.lowStockThreshold) !== "in-stock",
  );

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 864e5);
    return {
      key: d.toDateString(),
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      revenue: 0,
    };
  });
  live.forEach((o) => {
    const d = days.find((x) => x.key === new Date(o.createdAt).toDateString());
    if (d) d.revenue += o.total;
  });

  const sold = new Map<string, number>();
  live.forEach((o) => o.items.forEach((i) => sold.set(i.name, (sold.get(i.name) ?? 0) + i.qty)));
  const top = [...sold.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    ["Revenue", formatPrice(revenue)],
    ["Orders", String(live.length)],
    ["Avg. order", formatPrice(live.length ? revenue / live.length : 0)],
    ["Needs restock", String(low.length)],
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-card p-4 shadow-soft">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="mt-1 font-display text-2xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-card p-4 shadow-soft lg:col-span-2">
          <p className="mb-3 font-semibold">Revenue, last 14 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" fontSize={11} interval={1} />
                <YAxis fontSize={11} width={48} />
                <Tooltip formatter={(v) => formatPrice(Number(v))} />
                <Bar dataKey="revenue" fill="oklch(0.575 0.153 40)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-soft">
          <p className="mb-3 font-semibold">Top sellers</p>
          <ul className="space-y-2 text-sm">
            {top.map(([n, q]) => (
              <li key={n} className="flex justify-between gap-2">
                <span className="truncate">{n}</span>
                <span className="text-muted-foreground">{q} sold</span>
              </li>
            ))}
            {top.length === 0 && <li className="text-muted-foreground">No sales yet</li>}
          </ul>
        </div>
      </div>
      <div className="rounded-2xl bg-card p-4 shadow-soft">
        <p className="mb-3 font-semibold">Recent orders</p>
        <ul className="divide-y divide-border text-sm">
          {orders.slice(0, 6).map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-2">
              <span className="font-medium">{o.reference}</span>
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {o.address.fullName}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${statusTone(o.status)}`}>
                {o.status}
              </span>
              <span className="w-24 text-right">{formatPrice(o.total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
