"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { SectionHeading } from "@/components/storefront/storefront-shell";
import { useCartStore } from "@/stores/cart.store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const formatPrice = (price: number) => `LKR ${price.toLocaleString("en-LK")}`;

  return (
    <main className="min-h-screen bg-white text-[#111]">
      {/* Header */}
      <section className="bg-[#111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
            Shopping Bag
          </p>

          <h1 className="font-heading mt-3 text-5xl font-semibold leading-[0.95] sm:text-7xl">
            Your Cart
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            Review your selected products before continuing to checkout.
          </p>
        </div>
      </section>

      {/* Cart */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="mb-8 flex items-end justify-between gap-4">
              <SectionHeading
                eyebrow={`${itemCount} ${itemCount === 1 ? "Item" : "Items"}`}
                title="Your Selection"
                copy="Adjust quantities or remove products before checkout."
              />

              <button
                type="button"
                onClick={clearCart}
                className="hidden text-xs font-bold uppercase tracking-[0.16em] text-red-600 transition hover:text-red-800 sm:block"
              >
                Clear Cart
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              {/* Cart Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.productId}
                    className="border border-[#e7e2d8] bg-white p-4 sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#f7f4ed] sm:h-36 sm:w-28">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h2 className="truncate text-base font-bold text-[#111] sm:text-lg">
                            {item.productName}
                          </h2>

                          <p className="mt-2 text-sm text-[#777]">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          {/* Quantity */}
                          <div className="inline-flex h-10 items-center border border-[#ded7ca]">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.productId)}
                              className="flex h-full w-10 items-center justify-center transition hover:bg-[#f8f5ee]"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="flex h-full min-w-10 items-center justify-center border-x border-[#ded7ca] text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.productId)}
                              className="flex h-full w-10 items-center justify-center transition hover:bg-[#f8f5ee]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-red-600 transition hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="hidden text-right sm:block">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#999]">
                          Total
                        </p>

                        <p className="mt-2 font-bold text-[#111]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Mobile total */}
                    <div className="mt-4 flex items-center justify-between border-t border-[#eee8dd] pt-4 sm:hidden">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#999]">
                        Item Total
                      </span>

                      <span className="font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-red-600 sm:hidden"
                >
                  Clear Cart
                </button>
              </div>

              {/* Summary */}
              <aside className="h-fit border border-[#e7e2d8] bg-[#faf8f2] p-6 sm:p-7">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#9d7415]">
                  Order Summary
                </p>

                <h2 className="mt-3 text-2xl font-bold">Cart Total</h2>

                <div className="mt-7 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Subtotal</span>

                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Delivery</span>

                    <span className="text-[#777]">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-[#ded7ca] pt-5">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>

                      <span className="text-lg font-bold">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="mt-7 flex min-h-12 items-center justify-center gap-3 bg-[#d5aa42] px-6 text-sm font-bold uppercase tracking-[0.15em] text-[#111] transition hover:bg-[#f4c95d]"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/shop"
                  className="mt-4 block text-center text-xs font-bold uppercase tracking-[0.15em] text-[#555] hover:text-[#111]"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="border border-[#e7e2d8] bg-[#faf8f2] px-6 py-16 text-center sm:py-20">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#111] text-[#f4c95d]">
        <ShoppingBag className="h-7 w-7" />
      </span>

      <p className="mt-7 text-[0.72rem] font-bold uppercase tracking-[0.25em] text-[#9d7415]">
        Your Cart
      </p>

      <h2 className="mt-3 text-3xl font-bold">Your cart is empty.</h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#666]">
        Discover our collection and add something special to your shopping bag.
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#111] px-7 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]"
      >
        Explore Collection
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
