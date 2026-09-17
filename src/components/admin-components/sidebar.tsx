"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Create Product", href: "/admin/products/create" },
  { label: "Category Management", href: "/admin/categories" },
  { label: "Manage Hero", href: "/admin/hero" },
  { label: "Manage Gallery", href: "/admin/gallery" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full min-h-screen w-64 flex-col border-r border-zinc-200 bg-white px-6 py-8">
      <div className="mb-10 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
          Admin
        </p>
        <h2 className="text-xl font-semibold text-zinc-900">Store Console</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-xl px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-dashed border-zinc-200 p-4 text-xs text-zinc-500">
        Add inventory, orders, and analytics when you are ready to scale.
      </div>
    </aside>
  );
}
