"use client";
import { useEffect, useState } from "react";
import { StatusTimeline } from "@/components/admin/StatusTimeline";
import { trackOrder, type Tracking } from "@/lib/store/repo";

export default function TrackOrder() {
  const [ref, setRef] = useState("");
  const [order, setOrder] = useState<Tracking | null | undefined>(undefined);
  const find = async (v: string) => setOrder(v.trim() ? await trackOrder(v) : undefined);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      setRef(id);
      void find(id);
    }
  }, []);

  return (
    <section className="mx-auto max-w-md px-4 pb-24">
      <h1 className="text-4xl">Track your order</h1>
      <form
        className="mt-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void find(ref);
        }}
      >
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Order ID, e.g. BC-7K3M9Q"
          className="flex-1 rounded-full border border-input bg-card px-4 py-3 text-sm"
        />
        <button className="btn-ember rounded-full px-6 text-sm font-semibold">Track</button>
      </form>
      {order === null && (
        <p className="mt-6 text-sm text-muted-foreground">
          We couldn't find that order. Check the ID and try again.
        </p>
      )}
      {order && (
        <div className="mt-8 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
          <p className="mb-4 font-semibold">
            {order.reference} · {order.status}
          </p>
          <StatusTimeline order={order} />
        </div>
      )}
    </section>
  );
}
