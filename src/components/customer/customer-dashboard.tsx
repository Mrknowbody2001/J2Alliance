"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  Bell,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Gift,
  Heart,
  MapPin,
  Package,
  RotateCcw,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Star,
  UserRound,
} from "lucide-react";

type CustomerProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
};
type SavedAddress = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string | null;
};
type CustomerOrder = {
  id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    productTitle: string;
    quantity: number;
    total: number;
  }[];
};
const sections = [
  { id: "overview", label: "Overview", icon: UserRound },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "tracking", label: "Track Order", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
  { id: "reviews", label: "My Reviews", icon: Star },
  { id: "rewards", label: "Coupons & Rewards", icon: Gift },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile & Details", icon: Settings2 },
];

export function CustomerDashboard({
  customer,
  orders,
  addresses: initialAddresses,
}: {
  customer: CustomerProfile;
  orders: CustomerOrder[];
  addresses: SavedAddress[];
}) {
  const router = useRouter();
  const [active, setActive] = useState("overview");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [addressError, setAddressError] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    function selectHashSection() {
      const section = window.location.hash.slice(1);
      if (sections.some((item) => item.id === section)) setActive(section);
    }
    selectHashSection();
    window.addEventListener("hashchange", selectHashSection);
    return () => window.removeEventListener("hashchange", selectHashSection);
  }, []);

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddressError("");
    setAddressSaved(false);
    const form = event.currentTarget;
    const response = await fetch("/api/customer/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    });
    const result = await response.json();
    if (!response.ok) {
      setAddressError(result.error || "Unable to save address.");
      return;
    }
    setAddresses((current) => [result.address, ...current]);
    setAddressSaved(true);
    form.reset();
  }

  async function deleteAddress(id: string) {
    const response = await fetch(
      `/api/customer/addresses?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    if (response.ok)
      setAddresses((current) => current.filter((item) => item.id !== id));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    setError("");
    setLoading(true);
    const values = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to update your details.");
      setSaved(true);
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to update your details.",
      );
    } finally {
      setLoading(false);
    }
  }

  const current =
    sections.find((section) => section.id === active) ?? sections[0];
  const initials =
    `${customer.firstName[0] ?? "J"}${customer.lastName[0] ?? "2"}`.toUpperCase();

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-10 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.26em] text-[#d5aa42]">
              Your account
            </p>
            <h1 className="mt-2 font-heading text-4xl sm:text-5xl">
              Customer dashboard
            </h1>
            <p className="mt-2 text-sm text-white/45">
              Welcome back, {customer.firstName}. Your J2Alliance account, all
              in one place.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-[#111] px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d5aa42]/15 text-sm font-bold text-[#e7c15d]">
              {initials}
            </span>
            <div>
              <p className="text-sm font-semibold">
                {customer.firstName} {customer.lastName}
              </p>
              <p className="text-xs text-white/40">{customer.email}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-white/8 bg-[#101010] p-3">
            <p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[.22em] text-white/35">
              Account menu
            </p>
            <nav
              className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1"
              aria-label="Customer dashboard sections"
            >
              {sections.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActive(id);
                    setSaved(false);
                    setError("");
                  }}
                  aria-current={active === id ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-left text-xs font-medium transition sm:text-sm ${active === id ? "bg-[#d5aa42] text-[#15120b]" : "text-white/55 hover:bg-white/5 hover:text-white"}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                  {active === id && (
                    <ChevronRight className="ml-auto hidden h-4 w-4 lg:block" />
                  )}
                </button>
              ))}
            </nav>
            <div className="mt-4 rounded-xl border border-white/6 bg-white/[.025] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <ShieldCheck className="h-4 w-4 text-[#d5aa42]" />
                Account security
              </div>
              <p className="mt-2 text-xs leading-5 text-white/35">
                Email verification will be available in a future update.
              </p>
            </div>
          </aside>

          <section className="min-h-[560px] rounded-2xl border border-white/8 bg-[#101010] p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#d5aa42]">
                  J2Alliance account
                </p>
                <h2 className="mt-2 font-heading text-3xl">{current.label}</h2>
                <p className="mt-1 text-sm text-white/40">
                  {active === "profile"
                    ? "Manage your personal details and delivery address."
                    : "A clear view of your shopping with J2Alliance."}
                </p>
              </div>
              <current.icon className="mt-1 h-5 w-5 text-[#d5aa42]" />
            </div>

            {active === "overview" && (
              <div className="pt-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Orders", String(orders.length), ClipboardList],
                    ["Wishlist", "Saved items", Heart],
                    [
                      "Profile",
                      customer.phone ? "Details added" : "Complete details",
                      MapPin,
                    ],
                  ].map(([title, detail, Icon]) => {
                    const TileIcon = Icon as typeof ClipboardList;
                    return (
                      <button
                        key={title as string}
                        onClick={() =>
                          setActive(
                            title === "Orders"
                              ? "orders"
                              : title === "Wishlist"
                                ? "wishlist"
                                : "profile",
                          )
                        }
                        className="rounded-2xl border border-white/8 bg-[#151515] p-5 text-left transition hover:border-[#d5aa42]/35"
                      >
                        <TileIcon className="h-5 w-5 text-[#d5aa42]" />
                        <p className="mt-5 text-xs text-white/40">
                          {title as string}
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {detail as string}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-2xl border border-[#d5aa42]/15 bg-[linear-gradient(120deg,rgba(213,170,66,.08),rgba(255,255,255,.015))] p-6">
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d5aa42]">
                    Your next step
                  </p>
                  <h3 className="mt-2 font-heading text-2xl">
                    Make checkout a little easier.
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-white/45">
                    Add your phone number and delivery address to your profile,
                    then they’ll be ready when you shop.
                  </p>
                  <button
                    onClick={() => setActive("profile")}
                    className="mt-5 rounded-xl bg-[#d5aa42] px-4 py-2.5 text-xs font-bold text-[#17130a] transition hover:bg-[#efc85f]"
                  >
                    Complete your profile
                  </button>
                </div>
              </div>
            )}

            {active === "profile" && (
              <form onSubmit={saveProfile} className="max-w-3xl pt-6">
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-white/8 bg-white/[.025] p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#d5aa42]" />
                  <div>
                    <p className="text-sm font-semibold">Email address</p>
                    <p className="mt-1 text-sm text-white/45">
                      {customer.email}
                    </p>
                    <p className="mt-2 text-xs text-white/30">
                      Email changes and verification will be added in a future
                      update.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ProfileField
                    name="firstName"
                    label="First name"
                    defaultValue={customer.firstName}
                    required
                  />
                  <ProfileField
                    name="lastName"
                    label="Last name"
                    defaultValue={customer.lastName}
                    required
                  />
                  <ProfileField
                    name="phone"
                    label="Phone number"
                    defaultValue={customer.phone ?? ""}
                    type="tel"
                    placeholder="Add a phone number"
                  />
                  <ProfileField
                    name="city"
                    label="City"
                    defaultValue={customer.city ?? ""}
                    placeholder="City"
                  />
                  <div className="sm:col-span-2">
                    <ProfileField
                      name="address"
                      label="Delivery address"
                      defaultValue={customer.address ?? ""}
                      placeholder="Street, building, apartment"
                    />
                  </div>
                  <ProfileField
                    name="postalCode"
                    label="Postal code"
                    defaultValue={customer.postalCode ?? ""}
                    placeholder="Postal code"
                  />
                </div>
                {error && (
                  <p
                    role="alert"
                    className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200"
                  >
                    {error}
                  </p>
                )}
                {saved && (
                  <p
                    role="status"
                    className="mt-4 flex items-center gap-2 text-sm text-emerald-300"
                  >
                    <Check className="h-4 w-4" />
                    Your profile has been updated.
                  </p>
                )}
                <button
                  disabled={loading}
                  className="mt-6 rounded-xl bg-[#d5aa42] px-5 py-3 text-sm font-bold text-[#17130a] transition hover:bg-[#efc85f] disabled:opacity-60"
                >
                  {loading ? "Saving…" : "Save changes"}
                </button>
              </form>
            )}

            {active === "orders" && (
              <div className="space-y-4 pt-6">
                {orders.length === 0 ? (
                  <p className="rounded-xl border border-white/8 bg-[#151515] p-6 text-sm text-white/50">
                    No orders yet. Orders placed while signed in will appear
                    here.
                  </p>
                ) : (
                  orders.map((order) => (
                    <article
                      key={order.id}
                      className="rounded-xl border border-white/8 bg-[#151515] p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{order.orderNumber}</p>
                          <p className="mt-1 text-xs text-white/40">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-[#d5aa42]/10 px-3 py-1 text-xs capitalize text-[#e7c15d]">
                          {order.orderStatus.toLowerCase()}
                        </span>
                      </div>
                      <div className="mt-4 space-y-2 border-t border-white/8 pt-4">
                        {order.items.map((item) => (
                          <p
                            key={item.id}
                            className="flex justify-between gap-3 text-sm text-white/55"
                          >
                            <span>
                              {item.productTitle} × {item.quantity}
                            </span>
                            <span>
                              LKR {item.total.toLocaleString("en-LK")}
                            </span>
                          </p>
                        ))}
                      </div>
                      <p className="mt-4 text-right text-sm font-semibold">
                        Total: LKR {order.total.toLocaleString("en-LK")}
                      </p>
                      <p className="mt-1 text-right text-xs text-white/35">
                        Payment: {order.paymentStatus.toLowerCase()}
                      </p>
                    </article>
                  ))
                )}
              </div>
            )}

            {active === "addresses" && (
              <div className="max-w-3xl pt-6">
                <div className="space-y-3">
                  {addresses.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-white/8 bg-[#151515] p-5"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.label}{" "}
                          <span className="ml-2 text-xs font-normal text-white/40">
                            {item.recipient}
                          </span>
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/50">
                          {item.address}, {item.city}
                          {item.postalCode ? ` ${item.postalCode}` : ""}
                          <br />
                          {item.phone}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteAddress(item.id)}
                        className="text-xs font-semibold text-red-300 hover:text-red-200"
                      >
                        Remove
                      </button>
                    </article>
                  ))}
                </div>
                <form
                  onSubmit={saveAddress}
                  className="mt-6 grid gap-4 rounded-xl border border-white/8 bg-[#151515] p-5 sm:grid-cols-2"
                >
                  <h3 className="font-semibold sm:col-span-2">
                    Add a delivery address
                  </h3>
                  <ProfileField
                    name="label"
                    label="Label"
                    defaultValue="Home"
                  />
                  <ProfileField
                    name="recipient"
                    label="Recipient name"
                    defaultValue={`${customer.firstName} ${customer.lastName}`}
                    required
                  />
                  <ProfileField
                    name="phone"
                    label="Phone"
                    defaultValue={customer.phone ?? ""}
                    required
                    type="tel"
                  />
                  <ProfileField
                    name="city"
                    label="City"
                    defaultValue={customer.city ?? ""}
                    required
                  />
                  <div className="sm:col-span-2">
                    <ProfileField
                      name="address"
                      label="Street address"
                      defaultValue={customer.address ?? ""}
                      required
                    />
                  </div>
                  <ProfileField
                    name="postalCode"
                    label="Postal code"
                    defaultValue={customer.postalCode ?? ""}
                  />
                  <div className="flex items-end">
                    <button className="rounded-xl bg-[#d5aa42] px-5 py-3 text-sm font-bold text-[#17130a]">
                      Save address
                    </button>
                  </div>
                  {addressError && (
                    <p
                      role="alert"
                      className="text-sm text-red-300 sm:col-span-2"
                    >
                      {addressError}
                    </p>
                  )}
                  {addressSaved && (
                    <p
                      role="status"
                      className="text-sm text-emerald-300 sm:col-span-2"
                    >
                      Address saved.
                    </p>
                  )}
                </form>
              </div>
            )}

            {![
              "overview",
              "profile",
              "orders",
              "addresses",
              "wishlist",
            ].includes(active) && (
              <div className="flex min-h-[380px] flex-col items-center justify-center px-4 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d5aa42]/20 bg-[#d5aa42]/8 text-[#d5aa42]">
                  <current.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-heading text-2xl">
                  {active === "orders"
                    ? "Your orders will appear here"
                    : active === "wishlist"
                      ? "Your saved pieces will appear here"
                      : `${current.label} is coming soon`}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                  {active === "orders" || active === "wishlist"
                    ? "When you shop with J2Alliance, this space will keep everything easy to find."
                    : "This part of your customer dashboard is ready for a future update."}
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-white/75 transition hover:border-[#d5aa42]/40 hover:text-[#e7c15d]"
                >
                  Explore the shop
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </section>
        </div>
        <p className="mt-7 flex items-center justify-center gap-2 text-xs text-white/30">
          <CircleHelp className="h-3.5 w-3.5" />
          Need a hand?{" "}
          <Link href="/contact" className="text-[#d5aa42] hover:text-[#f1d275]">
            Contact customer care
          </Link>
        </p>
      </div>
    </main>
  );
}

function ProfileField({
  name,
  label,
  defaultValue,
  required,
  type = "text",
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium text-white/70">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-3.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#d5aa42]/70 focus:ring-2 focus:ring-[#d5aa42]/10"
      />
    </label>
  );
}
