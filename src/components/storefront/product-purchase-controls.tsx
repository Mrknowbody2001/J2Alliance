"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useWishlistStore } from "@/stores/wishlist.store";

type ProductPurchaseControlsProps = {
  product: {
    id: string;
    title: string;
    price: number;
    image: string | null;
  };
};

export default function ProductPurchaseControls({
  product,
}: ProductPurchaseControlsProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex h-12 items-center overflow-hidden rounded-md border border-[#e2d8c7]">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="inline-flex h-12 w-12 items-center justify-center text-[#555]"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="inline-flex h-12 w-12 items-center justify-center border-x border-[#e2d8c7] text-sm font-bold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="inline-flex h-12 w-12 items-center justify-center text-[#555]"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            addToCart({
              productId: product.id,
              productName: product.title,
              price: product.price,
              image: product.image ?? "",
              quantity,
            });
            setAddedToCart(true);
          }}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d5aa42] px-7 text-sm font-bold uppercase tracking-[0.14em] text-[#111] transition hover:bg-[#f4c95d]"
        >
          <ShoppingBag className="h-4 w-4" />
          {addedToCart ? "Added to Cart" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              productId: product.id,
              productName: product.title,
              price: product.price,
              image: product.image ?? "",
            })
          }
          aria-pressed={isInWishlist}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#e2d8c7] px-5 text-sm font-bold uppercase tracking-[0.14em] transition hover:border-[#d5aa42] hover:bg-[#fff8e3]"
        >
          <Heart
            className={`h-4 w-4 ${isInWishlist ? "fill-current text-red-600" : ""}`}
          />
          {isInWishlist ? "Saved" : "Favorite"}
        </button>
      </div>
      {addedToCart && (
        <p role="status" className="mt-3 text-sm font-medium text-green-700">
          {product.title} added to your cart.
        </p>
      )}
    </div>
  );
}
