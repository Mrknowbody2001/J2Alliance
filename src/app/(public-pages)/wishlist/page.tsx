"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist,
  );
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addToCart);

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#111] px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl border border-white/10 bg-[#1b1b1b] px-6 py-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d5aa42]">Saved pieces</p>
          <h1 className="font-heading mt-3 text-4xl font-semibold">My Wishlist</h1>

          <p className="mt-4 text-white/55">
            You haven&apos;t added any products to your wishlist yet.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-block rounded-md bg-[#d5aa42] px-6 py-3 font-semibold text-[#111] transition hover:bg-[#f4c95d]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#d5aa42]">Saved pieces</p>
            <h1 className="font-heading mt-2 text-4xl font-semibold">My Wishlist</h1>

            <p className="mt-2 text-white/50">
              {items.length} {items.length === 1 ? "product" : "products"}
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="text-sm text-red-400 hover:text-red-300 hover:underline"
          >
            Clear Wishlist
          </button>
        </div>

        {/* Wishlist Products */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="overflow-hidden rounded-lg border border-white/10 bg-[#1b1b1b]"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] bg-[#242424]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-wider text-white/40">
                    Product image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h2 className="font-medium">{item.productName}</h2>

                <p className="mt-2 font-semibold text-[#f4c95d]">
                  LKR {item.price.toLocaleString()}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({
                        productId: item.productId,
                        productName: item.productName,
                        price: item.price,
                        image: item.image,
                        quantity: 1,
                      })
                    }
                    className="inline-flex min-h-10 items-center justify-center gap-2 bg-[#d5aa42] px-3 text-sm font-semibold text-[#111] transition hover:bg-[#f4c95d]"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.productId)}
                    className="inline-flex min-h-10 items-center justify-center gap-2 border border-red-400/50 px-3 text-sm text-red-300 transition hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
