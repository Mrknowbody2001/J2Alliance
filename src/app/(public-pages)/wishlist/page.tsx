"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/stores/wishlist.store";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeFromWishlist = useWishlistStore(
    (state) => state.removeFromWishlist
  );
  const clearWishlist = useWishlistStore(
    (state) => state.clearWishlist
  );

  if (items.length === 0) {
    return (
      <main className="min-h-screen px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-semibold">
            My Wishlist
          </h1>

          <p className="mt-4 text-gray-500">
            You haven't added any products to your wishlist yet.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-block rounded-md bg-black px-6 py-3 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">
              My Wishlist
            </h1>

            <p className="mt-2 text-gray-500">
              {items.length}{" "}
              {items.length === 1 ? "product" : "products"}
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="text-sm text-red-500 hover:underline"
          >
            Clear Wishlist
          </button>
        </div>

        {/* Wishlist Products */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="overflow-hidden rounded-lg border bg-white"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h2 className="font-medium">
                  {item.productName}
                </h2>

                <p className="mt-2 font-semibold">
                  LKR {item.price.toLocaleString()}
                </p>

                <button
                  onClick={() =>
                    removeFromWishlist(item.productId)
                  }
                  className="mt-4 w-full rounded-md border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}