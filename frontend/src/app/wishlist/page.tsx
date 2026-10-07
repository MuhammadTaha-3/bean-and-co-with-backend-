import type { Metadata } from "next";
import { WishlistView } from "@/components/pages/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved Bean & Co favourites.",
};

export default function Page() {
  return <WishlistView />;
}
