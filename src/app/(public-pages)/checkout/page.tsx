"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart.store";

export default function CheckoutPage() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "TEST",
  });

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const deliveryFee = 0;

  const total = subtotal + deliveryFee;

  const formatPrice = (price: number) => `LKR ${price.toLocaleString("en-LK")}`;

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      /*
       * TEST ORDER
       *
       * We are not connecting a real payment gateway yet.
       * Later this section will be replaced/extended with
       * the real payment process.
       */

      const orderData = {
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },

        items,

        subtotal,
        deliveryFee,
        total,

        paymentMethod: "TEST",
        paymentStatus: "PAID",
        orderStatus: "PENDING",
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order.");
      }

      console.log("ORDER CREATED:", result.order);

      alert(
        `Order created successfully!\nOrder No: ${result.order.orderNumber}`,
      );

      clearCart();

      router.push("/shop");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#111]">
        <section className="bg-[#111] text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
              Checkout
            </p>

            <h1 className="font-heading mt-3 text-5xl font-semibold leading-[0.95] sm:text-7xl">
              Your Cart Is Empty
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-10">
          <ShoppingBag className="mx-auto h-12 w-12 text-[#d5aa42]" />

          <h2 className="mt-6 text-3xl font-bold">Nothing to checkout yet.</h2>

          <p className="mt-4 text-sm leading-7 text-[#666]">
            Add some products to your cart before continuing to checkout.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center gap-3 bg-[#111] px-7 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-[#333]"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111]">
      {/* Hero */}
      <section className="bg-[#111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
          <Link
            href="/Cart"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-white/60 transition hover:text-[#f4c95d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <p className="mt-8 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
            Secure Checkout
          </p>

          <h1 className="font-heading mt-3 text-5xl font-semibold leading-[0.95] sm:text-7xl">
            Complete Your Order
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
            Enter your delivery details and review your order before placing it.
          </p>
        </div>
      </section>

      {/* Checkout */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Customer Details */}
            <div className="space-y-8">
              {/* Contact */}
              <section className="border border-[#e7e2d8] bg-white p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111] text-[#f4c95d]">
                    <MapPin className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#9d7415]">
                      Step 01
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">
                      Delivery Details
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="First Name"
                    required
                    value={form.firstName}
                    onChange={(value) => updateField("firstName", value)}
                  />

                  <Field
                    label="Last Name"
                    required
                    value={form.lastName}
                    onChange={(value) => updateField("lastName", value)}
                  />

                  <Field
                    label="Email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                  />

                  <Field
                    label="Phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                  />
                </div>

                <div className="mt-4">
                  <Field
                    label="Address"
                    required
                    value={form.address}
                    onChange={(value) => updateField("address", value)}
                  />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="City"
                    required
                    value={form.city}
                    onChange={(value) => updateField("city", value)}
                  />

                  <Field
                    label="Postal Code"
                    value={form.postalCode}
                    onChange={(value) => updateField("postalCode", value)}
                  />
                </div>
              </section>

              {/* Payment */}
              <section className="border border-[#e7e2d8] bg-white p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111] text-[#f4c95d]">
                    <CreditCard className="h-5 w-5" />
                  </span>

                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#9d7415]">
                      Step 02
                    </p>

                    <h2 className="mt-1 text-2xl font-bold">Payment</h2>
                  </div>
                </div>

                {/* Test Payment */}
                <div className="mt-7 border border-[#d5aa42] bg-[#faf8f2] p-5">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9d7415]" />

                    <div>
                      <p className="font-bold">Test Payment</p>

                      <p className="mt-2 text-sm leading-6 text-[#666]">
                        Real payment processing is not connected yet. This
                        option is for testing the order flow.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <aside className="h-fit border border-[#e7e2d8] bg-[#faf8f2] p-6 sm:p-7 lg:sticky lg:top-6">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#9d7415]">
                Your Order
              </p>

              <h2 className="mt-3 text-2xl font-bold">Order Summary</h2>

              {/* Products */}
              <div className="mt-7 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-white">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-xs text-[#777]">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-[#ded7ca]" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666]">Subtotal</span>

                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#666]">Delivery</span>

                  <span>
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-[#ded7ca]" />

              <div className="flex items-center justify-between">
                <span className="font-bold">Total</span>

                <span className="text-xl font-bold">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 bg-[#d5aa42] px-6 text-sm font-bold uppercase tracking-[0.15em] text-[#111] transition hover:bg-[#f4c95d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Processing..." : "Place Test Order"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#777]">
                This is currently a test order. No real payment will be charged.
              </p>
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-[#333]">
      {label}
      {required && <span className="ml-1 text-[#d5aa42]">*</span>}

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-md border border-[#e2d8c7] bg-white px-4 text-sm outline-none transition focus:border-[#d5aa42]"
      />
    </label>
  );
}
