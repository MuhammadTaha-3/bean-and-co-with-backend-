import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bean & Co — Small-Batch Coffee Roastery",
    template: "%s — Bean & Co",
  },
  description:
    "Small-batch coffee roasted since 1978. Signature lattes, cold brew and beans for home.",
  authors: [{ name: "Bean & Co" }],
  openGraph: {
    title: "Bean & Co — Small-Batch Coffee Roastery",
    description: "Small-batch coffee roasted since 1978. Coffee worth lingering over.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
