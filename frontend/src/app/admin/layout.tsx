"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Boxes, LayoutDashboard, LogOut, Package, ShoppingBag, Tags } from "lucide-react";
import { adminLogout, hasAdminSession } from "@/lib/admin/auth";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const isLogin = path === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    let live = true;
    void hasAdminSession().then((yes) => {
      if (!live) return;
      if (yes) setOk(true);
      else router.replace("/admin/login");
    });
    return () => {
      live = false;
    };
  }, [isLogin, path, router]);

  if (isLogin) return <>{children}</>;
  if (!ok) return null;

  return (
    <div className="min-h-screen bg-secondary/40 md:flex">
      <aside className="bg-espresso text-cream md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0">
        <div className="flex items-center justify-between px-5 py-4 md:block">
          <p className="font-display text-xl">Bean &amp; Co</p>
          <p className="text-xs text-cream/60">Admin portal</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? path === href : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm ${active ? "bg-cream/15 font-semibold" : "text-cream/75 hover:bg-cream/10"}`}
              >
                <Icon className="size-4" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-3 pt-6 md:block">
          <Link
            href="/"
            className="block rounded-xl px-3 py-2 text-sm text-cream/75 hover:bg-cream/10"
          >
            View storefront
          </Link>
          <button
            onClick={async () => {
              await adminLogout();
              router.replace("/admin/login");
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-cream/75 hover:bg-cream/10"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
