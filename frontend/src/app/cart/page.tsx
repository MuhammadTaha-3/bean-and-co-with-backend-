import type { Metadata } from "next";
import { CartView } from "@/components/pages/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your Bean & Co cart.",
};

export default function Page() {
  return <CartView />;
}
