import type { Metadata } from "next";
import { ProductsView } from "@/components/pages/ProductsView";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse every Bean & Co drink, bake and bean. Search, filter and add to cart.",
};

export default function Page() {
  return <ProductsView />;
}
