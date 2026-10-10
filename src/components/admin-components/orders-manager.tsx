"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

type Order = {
  id: string; orderNumber: string; customerFirstName: string; customerLastName: string;
  customerEmail: string; customerPhone: string; customerAddress: string; customerCity: string;
  customerCountry: string; customerPostalCode: string | null; subtotal: number; deliveryFee: number;
  total: number; paymentMethod: string; paymentStatus: string; orderStatus: string; createdAt: string;
  items: { id: string; productTitle: string; price: number; quantity: number; total: number }[];
};

const orderStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const paymentStatuses = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const money = (value: number) => `LKR ${value.toLocaleString("en-LK")}`;

export default function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/orders").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load orders.");
      setOrders(data.orders);
    }).catch((reason: Error) => setError(reason.message));
  }, []);

  const visibleOrders = useMemo(() => orders.filter((order) => {
    const matchesStatus = filter === "ALL" || order.orderStatus === filter;
    const needle = search.trim().toLowerCase();
    const matchesSearch = !needle || [order.orderNumber, order.customerFirstName, order.customerLastName, order.customerEmail, order.customerCountry].some((value) => value.toLowerCase().includes(needle));
    return matchesStatus && matchesSearch;
  }), [orders, filter, search]);

  async function updateOrder(id: string, field: "orderStatus" | "paymentStatus", value: string) {
    setBusy(id); setError("");
    try {
      const response = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: value }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update order.");
      setOrders((current) => current.map((order) => order.id === id ? data.order : order));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update order."); }
    finally { setBusy(null); }
  }

  return <div className="space-y-7">
    <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Store operations</p><h1 className="mt-2 text-3xl font-semibold text-zinc-900">Order Management</h1><p className="mt-2 text-sm text-zinc-500">Review delivery details and keep each order and payment status current.</p></div>
    <div className="grid gap-3 sm:grid-cols-3">
      {[["Total orders", orders.length], ["Needs attention", orders.filter((order) => order.orderStatus === "PENDING").length], ["In delivery", orders.filter((order) => ["PROCESSING", "SHIPPED"].includes(order.orderStatus)).length]].map(([label, value]) => <div key={label} className="rounded-xl border border-zinc-200 bg-white p-5"><p className="text-sm text-zinc-500">{label}</p><p className="mt-2 text-2xl font-semibold text-zinc-900">{value}</p></div>)}
    </div>
    <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row">
      <label className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order, customer, or country" className="h-10 w-full rounded-lg border border-zinc-200 pl-9 pr-3 text-sm outline-none focus:border-zinc-400" /></label>
      <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm"><option value="ALL">All statuses</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select>
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    {orders.length === 0 && !error ? <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500">No orders have been placed yet.</div> : visibleOrders.length === 0 ? <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">No orders match this search.</div> : <div className="space-y-4">{visibleOrders.map((order) => <article key={order.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 md:flex-row md:items-start md:justify-between"><div><p className="font-semibold text-zinc-900">{order.orderNumber}</p><p className="mt-1 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString()} · {order.customerFirstName} {order.customerLastName}</p><a className="mt-1 block text-sm text-zinc-600 hover:underline" href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a></div><div className="flex flex-wrap gap-3"><label className="text-xs text-zinc-500">Order status<select disabled={busy === order.id} value={order.orderStatus} onChange={(event) => updateOrder(order.id, "orderStatus", event.target.value)} className="mt-1 block h-9 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-800">{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select></label><label className="text-xs text-zinc-500">Payment status<select disabled={busy === order.id} value={order.paymentStatus} onChange={(event) => updateOrder(order.id, "paymentStatus", event.target.value)} className="mt-1 block h-9 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-800">{paymentStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div></div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_280px]"><div><h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Items</h2><div className="mt-3 divide-y divide-zinc-100">{order.items.map((item) => <div key={item.id} className="flex justify-between gap-4 py-2 text-sm"><span className="text-zinc-700">{item.productTitle} <span className="text-zinc-400">× {item.quantity}</span></span><span className="shrink-0 font-medium">{money(item.total)}</span></div>)}</div><div className="mt-3 space-y-1 border-t border-zinc-100 pt-3 text-sm"><p className="flex justify-between text-zinc-500"><span>Subtotal</span><span>{money(order.subtotal)}</span></p><p className="flex justify-between text-zinc-500"><span>Delivery</span><span>{money(order.deliveryFee)}</span></p><p className="flex justify-between pt-1 font-semibold text-zinc-900"><span>Total</span><span>{money(order.total)}</span></p></div></div>
      <div className="rounded-lg bg-zinc-50 p-4"><h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Ship to</h2><p className="mt-3 text-sm font-medium text-zinc-800">{order.customerFirstName} {order.customerLastName}</p><p className="mt-1 text-sm leading-6 text-zinc-600">{order.customerAddress}<br />{order.customerCity}{order.customerPostalCode ? `, ${order.customerPostalCode}` : ""}<br />{order.customerCountry}</p><a href={`tel:${order.customerPhone}`} className="mt-3 block text-sm text-zinc-600 hover:underline">{order.customerPhone}</a><p className="mt-3 text-xs text-zinc-400">Payment: {order.paymentMethod}</p></div>
      </div>
    </article>)}</div>}
  </div>;
}
