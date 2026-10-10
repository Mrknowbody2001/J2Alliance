"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ShoppingBag, UserRound, Heart } from "lucide-react";

export default function CustomerPrivateNavigation() {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/customer/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  }

  return (
    <nav
      aria-label="Customer navigation"
      className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0d] text-white shadow-lg"
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-7 lg:px-10">
        <Link
          href="/account"
          className="font-heading text-xl font-semibold tracking-[.08em]"
        >
          J2Alliance<span className="text-[#d5aa42]">.</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-[#f4c95d]"
          >
            <UserRound className="h-4 w-4" />
            <span>My account</span>
          </Link>
          <Link
            href="/account#orders"
            className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-[#f4c95d] sm:block"
          >
            Orders
          </Link>
          <Link
            href="/account#addresses"
            className="hidden rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-[#f4c95d] sm:block"
          >
            Addresses
          </Link>
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-[#f4c95d]"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Wishlist</span>
          </Link>
          <Link
            href="/Cart"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/5 hover:text-[#f4c95d]"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
          </Link>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white/65 transition hover:border-[#d5aa42]/40 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
