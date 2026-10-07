import type { Metadata } from "next";
import { HomeView } from "@/components/pages/HomeView";

export const metadata: Metadata = {
  title: { absolute: "Bean & Co — Small-Batch Coffee Roastery" },
  description:
    "Bean & Co roasts small-batch coffee. Order signature lattes, 18-hour cold brew, espresso and beans for home.",
};

export default function Page() {
  return <HomeView />;
}
