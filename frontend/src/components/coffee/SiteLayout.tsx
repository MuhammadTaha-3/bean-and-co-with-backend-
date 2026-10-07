"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { easeOut } from "./motion-primitives";

export function SiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isHome ? (
        <main>{children}</main>
      ) : (
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="min-h-[70vh] pt-28 sm:pt-32"
        >
          {children}
        </motion.main>
      )}
      <Footer />
    </div>
  );
}
