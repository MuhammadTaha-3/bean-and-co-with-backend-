import type { Metadata } from "next";
import { CheckoutView } from "@/components/pages/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Bean & Co order.",
};

export default function Page() {
  return <CheckoutView />;
}
