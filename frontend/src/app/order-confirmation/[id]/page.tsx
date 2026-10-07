import type { Metadata } from "next";
import { OrderConfirmationView } from "@/components/pages/OrderConfirmationView";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderConfirmationView id={id} />;
}
