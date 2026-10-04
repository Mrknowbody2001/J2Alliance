"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: data.get("username"), password: data.get("password") }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Login failed.");
      router.replace("/admin"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Login failed."); }
    finally { setPending(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f5f3ef] px-5 py-12">
    <section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-900/5 sm:p-10">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white"><ShieldCheck size={22} /></div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Store Console</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-900">Admin sign in</h1>
      <p className="mt-2 text-sm text-zinc-500">Sign in to manage your storefront.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-zinc-700">Username<input name="username" autoComplete="username" required className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-500" placeholder="Enter username" /></label>
        <label className="block text-sm font-medium text-zinc-700">Password<input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-500" placeholder="Enter password" /></label>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60"><LockKeyhole size={16} />{pending ? "Signing in…" : "Sign in"}</button>
      </form>
      {/* <p className="mt-6 text-center text-xs text-zinc-400">Default login: admin / 123</p> */}
    </section>
  </main>;
}
