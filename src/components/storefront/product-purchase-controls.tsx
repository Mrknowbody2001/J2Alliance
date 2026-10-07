"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id),
  );

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex h-10 items-center overflow-hidden rounded-md border border-white/15 bg-[#171717]">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="inline-flex h-10 w-9 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="inline-flex h-10 w-8 items-center justify-center border-x border-white/15 text-sm font-semibold text-white">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            className="inline-flex h-10 w-9 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
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
          aria-label="Add to cart"
          title="Add to cart"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#d5aa42]/50 bg-[#242016] text-[#f4c95d] transition hover:bg-[#d5aa42] hover:text-[#111]"
        >
          <ShoppingBag className="h-4 w-4" />
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
          aria-label={isInWishlist ? "Remove from favorites" : "Add to favorites"}
          title={isInWishlist ? "Remove from favorites" : "Add to favorites"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white/75 transition hover:border-[#d5aa42] hover:bg-white/10 hover:text-[#f4c95d]"
        >
          <Heart
            className={`h-4 w-4 ${isInWishlist ? "fill-current text-red-600" : ""}`}
          />
        </button>
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
            router.push("/checkout");
          }}
          className="inline-flex h-10 items-center justify-center rounded-md bg-[#d5aa42] px-4 text-xs font-bold uppercase tracking-[0.1em] text-[#111] transition hover:bg-[#f4c95d]"
        >
          Buy now
        </button>
      </div>
      {addedToCart && (
        <p role="status" className="mt-3 text-sm font-medium text-emerald-300">
          {product.title} added to your cart.
        </p>
      )}
    </div>
  );
}
