"use client";

import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/admin-components/sidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login") return <>{children}</>;
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login"); router.refresh();
  }
  return <div className="min-h-screen bg-zinc-50"><div className="flex min-h-screen"><Sidebar /><div className="min-w-0 flex-1">
    <header className="flex h-[72px] items-center justify-end border-b border-zinc-200 bg-white px-6 md:px-8"><button onClick={logout} className="text-sm font-medium text-zinc-500 hover:text-zinc-900">Sign out</button></header>
    <main className="px-5 py-8 md:px-8 md:py-10">{children}</main>
  </div></div></div>;
}
