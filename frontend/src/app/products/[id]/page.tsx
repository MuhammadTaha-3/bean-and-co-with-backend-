import type { Metadata } from "next";
import { ProductDetailView } from "@/components/pages/ProductDetailView";

export const metadata: Metadata = { title: "Product" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailView id={id} />;
}
