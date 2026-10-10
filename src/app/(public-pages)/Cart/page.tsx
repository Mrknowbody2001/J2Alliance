"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
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
    <main className="min-h-screen bg-[#111] text-white">
      {/* Header */}
      <section className="bg-[#111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9 lg:px-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
            Shopping Bag
          </p>

          <h1 className="font-heading mt-2 text-4xl font-semibold leading-[0.98] sm:text-5xl">
            Your Cart
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
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
              <div>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">{itemCount} {itemCount === 1 ? "Item" : "Items"}</p>
                <h2 className="font-heading mt-3 text-4xl font-semibold leading-[0.98] text-white sm:text-5xl">Your Selection</h2>
                <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">Adjust quantities or remove products before checkout.</p>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="hidden text-xs font-bold uppercase tracking-[0.16em] text-red-400 transition hover:text-red-300 sm:block"
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
                    className="border border-white/10 bg-[#1b1b1b] p-4 sm:p-5"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-[#242424] sm:h-36 sm:w-28">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.productName}
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-xs font-semibold uppercase text-white/40">
                            Product image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <h2 className="truncate text-base font-bold text-white sm:text-lg">
                            {item.productName}
                          </h2>

                          <p className="mt-2 text-sm text-[#f4c95d]">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                          {/* Quantity */}
                          <div className="inline-flex h-10 items-center border border-white/15">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.productId)}
                              className="flex h-full w-10 items-center justify-center text-white/70 transition hover:bg-white/8 hover:text-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <span className="flex h-full min-w-10 items-center justify-center border-x border-white/15 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.productId)}
                              className="flex h-full w-10 items-center justify-center text-white/70 transition hover:bg-white/8 hover:text-white"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-red-400 transition hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="hidden text-right sm:block">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                          Total
                        </p>

                        <p className="mt-2 font-bold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Mobile total */}
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 sm:hidden">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
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
                  className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-red-400 sm:hidden"
                >
                  Clear Cart
                </button>
              </div>

              {/* Summary */}
              <aside className="h-fit border border-white/10 bg-[#1b1b1b] p-6 sm:p-7">
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#d5aa42]">
                  Order Summary
                </p>

                <h2 className="mt-3 text-2xl font-bold">Cart Total</h2>

                <div className="mt-7 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/55">Subtotal</span>

                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-[#666]">Delivery</span>

                    <span className="text-white/40">Calculated at checkout</span>
                  </div>

                  <div className="border-t border-white/10 pt-5">
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
                  className="mt-4 block text-center text-xs font-bold uppercase tracking-[0.15em] text-white/50 hover:text-white"
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
    <div className="border border-white/10 bg-[#1b1b1b] px-6 py-16 text-center sm:py-20">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#111] text-[#f4c95d]">
        <ShoppingBag className="h-7 w-7" />
      </span>

      <p className="mt-7 text-[0.72rem] font-bold uppercase tracking-[0.25em] text-[#d5aa42]">
        Your Cart
      </p>

      <h2 className="mt-3 text-3xl font-bold">Your cart is empty.</h2>

      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/55">
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
