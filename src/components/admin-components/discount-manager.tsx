"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Percent, Plus, Tag, Trash2 } from "lucide-react";

type Option = { id: string; name: string; categoryId?: string };
type DiscountRow = { id: string; name: string; scope: "CATEGORY" | "SUBCATEGORY" | "PRODUCT"; targetId: string; type: "PERCENTAGE" | "AMOUNT"; value: number; startsAt: string; endsAt: string; active: boolean };
type Props = { categories: Option[]; subcategories: Option[]; products: Option[]; discounts: DiscountRow[] };
const scopeNames = { CATEGORY: "Category", SUBCATEGORY: "Subcategory", PRODUCT: "Individual product" };

export default function DiscountManager({ categories, subcategories, products, discounts: initial }: Props) {
  const [discounts, setDiscounts] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [scope, setScope] = useState<DiscountRow["scope"]>("CATEGORY");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [form, setForm] = useState({ name: "", targetId: categories[0]?.id ?? "", type: "PERCENTAGE" as DiscountRow["type"], value: "", startsAt: "", endsAt: "" });
  const targets = scope === "CATEGORY" ? categories : scope === "SUBCATEGORY" ? subcategories.filter((item) => !categoryId || item.categoryId === categoryId) : products;
  const names = useMemo(() => new Map([...categories, ...subcategories, ...products].map((item) => [item.id, item.name])), [categories, subcategories, products]);
  const now = Date.now();

  function changeScope(next: DiscountRow["scope"]) {
    setScope(next);
    const nextTargets = next === "CATEGORY" ? categories : next === "SUBCATEGORY" ? subcategories : products;
    setForm((current) => ({ ...current, targetId: nextTargets[0]?.id ?? "" }));
  }

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const response = await fetch("/api/admin/discounts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, scope, value: Number(form.value), active: true, startsAt: new Date(form.startsAt).toISOString(), endsAt: new Date(form.endsAt).toISOString() }) });
    const data = await response.json();
    if (response.ok) { setDiscounts((items) => [data, ...items]); setForm((current) => ({ ...current, name: "", value: "" })); setMessage("Discount scheduled successfully."); }
    else setMessage(data.error ?? "Could not save this discount.");
    setBusy(false);
  }

  async function toggle(discount: DiscountRow) {
    const response = await fetch(`/api/admin/discounts/${discount.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !discount.active }) });
    if (response.ok) setDiscounts((items) => items.map((item) => item.id === discount.id ? { ...item, active: !item.active } : item));
  }
  async function remove(id: string) {
    const response = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    if (response.ok) setDiscounts((items) => items.filter((item) => item.id !== id));
  }

  const inputClass = "mt-2 h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10";
  const labelClass = "text-xs font-semibold uppercase tracking-[0.12em] text-stone-500";

  return <div className="mx-auto max-w-6xl space-y-8">
    <header className="relative overflow-hidden rounded-3xl bg-[#171714] px-7 py-8 text-white sm:px-10 sm:py-10">
      <div className="absolute -right-8 -top-16 h-64 w-64 rounded-full border border-amber-300/15" /><div className="absolute -right-1 top-1 h-48 w-48 rounded-full border border-amber-300/10" />
      <div className="relative flex flex-wrap items-end justify-between gap-5"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">Store promotions</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Discounts</h1><p className="mt-2 max-w-lg text-sm leading-6 text-white/60">Create timed offers for a whole category, a subcategory, or a single product.</p></div><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><Tag className="h-5 w-5 text-amber-300"/><div><p className="text-xl font-semibold">{discounts.filter((d) => d.active && Date.parse(d.startsAt) <= now && Date.parse(d.endsAt) > now).length}</p><p className="text-[11px] text-white/55">Live offers</p></div></div></div>
    </header>

    <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-100 px-6 py-5 sm:px-8"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><Plus className="h-5 w-5"/></div><div><h2 className="font-semibold text-stone-900">Create a discount</h2><p className="mt-0.5 text-xs text-stone-500">Set the offer and when it should appear in your store.</p></div></div></div>
      <form onSubmit={create} className="grid gap-x-6 gap-y-5 px-6 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        <label className={`${labelClass} sm:col-span-2 lg:col-span-1`}>Offer name<input required maxLength={80} placeholder="e.g. Summer collection offer" className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label>
        <label className={labelClass}>Apply discount to<select className={inputClass} value={scope} onChange={(e) => changeScope(e.target.value as DiscountRow["scope"])}>{Object.entries(scopeNames).map(([key, name]) => <option key={key} value={key}>{name}</option>)}</select></label>
        {scope === "SUBCATEGORY" && <label className={labelClass}>Main category<select className={inputClass} value={categoryId} onChange={(e) => { setCategoryId(e.target.value); const next = subcategories.find((x) => x.categoryId === e.target.value); if (next) setForm({ ...form, targetId: next.id }); }}>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
        <label className={labelClass}>{scope === "CATEGORY" ? "Choose category" : scope === "SUBCATEGORY" ? "Choose subcategory" : "Choose product"}<select required className={inputClass} value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })}>{targets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className={labelClass}>Discount type<select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as DiscountRow["type"] })}><option value="PERCENTAGE">Percentage off</option><option value="AMOUNT">Fixed amount off (LKR)</option></select></label>
        <label className={labelClass}>{form.type === "PERCENTAGE" ? "Percentage" : "Amount in LKR"}<div className="relative"><input required min="0.01" max={form.type === "PERCENTAGE" ? 100 : undefined} step="0.01" type="number" placeholder="0" className={`${inputClass} pr-11`} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}/><span className="absolute right-3 top-[1.15rem] text-stone-400">{form.type === "PERCENTAGE" ? <Percent className="h-4 w-4"/> : "LKR"}</span></div></label>
        <label className={labelClass}>Starts at<div className="relative"><input required type="datetime-local" className={`${inputClass} pr-9`} value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })}/><CalendarDays className="pointer-events-none absolute right-3 top-[1.1rem] h-4 w-4 text-stone-400"/></div></label>
        <label className={labelClass}>Ends at<div className="relative"><input required type="datetime-local" className={`${inputClass} pr-9`} value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })}/><CalendarDays className="pointer-events-none absolute right-3 top-[1.1rem] h-4 w-4 text-stone-400"/></div></label>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-3"><button disabled={busy || targets.length === 0} className="inline-flex h-11 items-center gap-2 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"><Check className="h-4 w-4"/>{busy ? "Saving…" : "Schedule discount"}</button>{message && <p role="status" className="text-sm text-stone-600">{message}</p>}{targets.length === 0 && <p className="text-sm text-amber-700">Add a {scope.toLowerCase()} before creating this offer.</p>}</div>
      </form>
    </section>

    <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-stone-100 px-6 py-5 sm:px-8"><div><h2 className="font-semibold text-stone-900">Your offers</h2><p className="mt-1 text-xs text-stone-500">{discounts.length} scheduled {discounts.length === 1 ? "offer" : "offers"}</p></div><Clock3 className="h-5 w-5 text-stone-400"/></div>
      {discounts.length === 0 ? <div className="px-6 py-14 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500"><Tag className="h-5 w-5"/></div><p className="mt-4 font-medium text-stone-800">No discounts yet</p><p className="mt-1 text-sm text-stone-500">Your scheduled offers will appear here.</p></div> : <div className="divide-y divide-stone-100">{discounts.map((discount) => { const starts = Date.parse(discount.startsAt); const ends = Date.parse(discount.endsAt); const live = discount.active && starts <= now && ends > now; const status = !discount.active ? "Paused" : starts > now ? "Scheduled" : ends <= now ? "Ended" : "Live"; return <article key={discount.id} className="flex flex-wrap items-center gap-4 px-6 py-4 sm:px-8"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${live ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}><Tag className="h-5 w-5"/></div><div className="min-w-[180px] flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-stone-900">{discount.name}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${live ? "bg-emerald-50 text-emerald-700" : status === "Ended" ? "bg-stone-100 text-stone-500" : "bg-amber-50 text-amber-700"}`}>{status}</span></div><p className="mt-1 text-xs text-stone-500">{scopeNames[discount.scope]} · {names.get(discount.targetId) ?? "Removed item"} · {new Date(discount.startsAt).toLocaleString()} – {new Date(discount.endsAt).toLocaleString()}</p></div><p className="min-w-[100px] text-sm font-semibold text-stone-900">{discount.type === "PERCENTAGE" ? `${discount.value}% off` : `LKR ${discount.value.toLocaleString()} off`}</p><button type="button" onClick={() => toggle(discount)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-600 hover:border-stone-400 hover:text-stone-900">{discount.active ? "Pause" : "Resume"}</button><button type="button" aria-label={`Delete ${discount.name}`} onClick={() => remove(discount.id)} className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4"/></button></article>; })}</div>}</section>
  </div>;
}
