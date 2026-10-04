"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Check, LockKeyhole, Sparkles } from "lucide-react";

export function CustomerAuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch(`/api/customer/${signup ? "signup" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong.");
      router.push("/account");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#090909] px-4 py-10 text-white selection:bg-[#d5aa42]/30 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111] shadow-[0_32px_100px_rgba(0,0,0,.5)] lg:grid-cols-[.95fr_1.05fr]">
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_20%_15%,rgba(213,170,66,.24),transparent_42%),linear-gradient(145deg,#171510,#090909_68%)] p-12 lg:flex">
          <div className="absolute -right-24 top-24 h-80 w-80 rounded-full border border-[#d5aa42]/20" />
          <div className="absolute -right-10 top-40 h-52 w-52 rounded-full border border-[#d5aa42]/15" />
          <Link href="/" className="relative font-heading text-4xl font-semibold tracking-[.08em]">J2Alliance<span className="text-[#d5aa42]">.</span></Link>
          <div className="relative max-w-sm">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d5aa42]/30 bg-[#d5aa42]/10 text-[#e4bd59]"><Sparkles className="h-5 w-5" /></div>
            <p className="text-xs font-semibold uppercase tracking-[.28em] text-[#d5aa42]">A more personal experience</p>
            <h1 className="mt-5 font-heading text-5xl leading-[1.05]">Thoughtful finds, <span className="text-[#d5aa42]">all in one place.</span></h1>
            <p className="mt-5 text-sm leading-7 text-white/55">Keep your details close and make every visit to J2Alliance feel like yours.</p>
          </div>
          <p className="relative text-xs tracking-wide text-white/35">J2ALLIANCE · ONLINE STORE</p>
        </section>

        <section className="flex min-h-[680px] flex-col justify-center px-6 py-10 sm:px-12 lg:px-14">
          <Link href="/" className="mb-10 font-heading text-3xl font-semibold tracking-[.08em] lg:hidden">J2Alliance<span className="text-[#d5aa42]">.</span></Link>
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#d5aa42]">Customer account</p>
          <h2 className="mt-3 font-heading text-4xl font-medium">{signup ? "Create your account" : "Welcome back"}</h2>
          <p className="mt-2 text-sm text-white/50">{signup ? "Join us and keep your shopping details together." : "Sign in to continue to your customer dashboard."}</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {signup && <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" name="firstName" autoComplete="given-name" required />
              <Field label="Last name" name="lastName" autoComplete="family-name" required />
            </div>}
            <Field label="Email address" name="email" type="email" autoComplete="email" required />
            <Field label="Password" name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 8 : undefined} required hint={signup ? "Use at least 8 characters." : undefined} />
            {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
            <button disabled={loading} className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d5aa42] px-5 text-sm font-bold text-[#17130a] transition hover:bg-[#efc85f] disabled:cursor-wait disabled:opacity-60">
              {loading ? "Please wait…" : signup ? "Create account" : "Sign in"}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-white/40"><LockKeyhole className="h-3.5 w-3.5" />Your account details are stored securely.</div>
          <p className="mt-8 text-center text-sm text-white/50">{signup ? "Already have an account?" : "New to J2Alliance?"}{" "}
            <Link className="font-semibold text-[#e2bc58] hover:text-[#f4d77d]" href={signup ? "/sign-in" : "/sign-up"}>{signup ? "Sign in" : "Create an account"}</Link>
          </p>
          {/* {signup && <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-white/35"><Check className="h-3.5 w-3.5 text-[#d5aa42]" />Email verification can be added later.</p>} */}
        </section>
      </div>
    </main>
  );
}

function Field({ label, name, type = "text", autoComplete, required, minLength, hint }: { label: string; name: string; type?: string; autoComplete?: string; required?: boolean; minLength?: number; hint?: string }) {
  return <label className="block text-sm font-medium text-white/75">{label}<input name={name} type={type} autoComplete={autoComplete} required={required} minLength={minLength} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d5aa42]/70 focus:ring-2 focus:ring-[#d5aa42]/10" />{hint && <span className="mt-2 block text-xs text-white/35">{hint}</span>}</label>;
}
