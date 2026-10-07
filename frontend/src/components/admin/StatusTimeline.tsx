import { ORDER_FLOW, type Order } from "@/lib/store/types";

/** Shared by the admin order dialog and the customer /track-order page. */
export function StatusTimeline({ order }: { order: Pick<Order, "status" | "history"> }) {
  if (order.status === "Cancelled")
    return (
      <p className="rounded-xl bg-red-100 p-3 text-sm text-red-800">This order was cancelled.</p>
    );
  const at = ORDER_FLOW.indexOf(order.status as (typeof ORDER_FLOW)[number]);
  return (
    <ol className="space-y-3">
      {ORDER_FLOW.map((s, i) => {
        const when = order.history?.find((h) => h.status === s)?.at;
        return (
          <li key={s} className="flex items-center gap-3 text-sm">
            <span
              className={`grid size-6 place-items-center rounded-full text-xs ${i <= at ? "bg-ember text-white" : "bg-secondary text-muted-foreground"}`}
            >
              {i <= at ? "✓" : ""}
            </span>
            <span className={i <= at ? "font-medium" : "text-muted-foreground"}>{s}</span>
            {when && (
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(when).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
