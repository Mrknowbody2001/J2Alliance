"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, ShieldCheck } from "lucide-react";

type ApiResult = { error?: unknown; emailHint?: unknown; resendAfter?: unknown } | null;

async function readResponse(response: Response, fallbackMessage: string) {
  const result = await response.json().catch(() => null) as ApiResult;
  if (!response.ok) throw new Error(typeof result?.error === "string" ? result.error : fallbackMessage);
  if (!result) throw new Error(fallbackMessage);
  return result;
}

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof TypeError) return "Unable to reach the sign-in service. Check your connection and try again.";
  return error instanceof Error ? error.message : fallback;
}

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [stage, setStage] = useState<"credentials" | "email" | "otp">("credentials");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!resendAt) return;
    const update = () => setSecondsLeft(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [resendAt]);

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      await readResponse(response, "We couldn’t sign you in. Please try again.");
      setStage("email");
    } catch (submitError) {
      setError(errorMessage(submitError, "We couldn’t sign you in. Please try again."));
    } finally {
      setPending(false);
    }
  }

  async function sendOtp(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: enteredEmail }),
      });
      const result = await readResponse(response, "We couldn’t send a verification code. Please try again.");
      setEmailHint(typeof result.emailHint === "string" ? result.emailHint : "your configured email");
      setResendAt(typeof result.resendAfter === "string" ? Date.parse(result.resendAfter) : Date.now() + 60_000);
      setStage("otp");
    } catch (sendError) {
      setError(errorMessage(sendError, "We couldn’t send a verification code. Please try again."));
    } finally {
      setPending(false);
    }
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: data.get("code") }),
      });
      await readResponse(response, "We couldn’t verify that code. Please try again.");
      router.replace("/admin");
      router.refresh();
    } catch (verifyError) {
      setError(errorMessage(verifyError, "We couldn’t verify that code. Please try again."));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f3ef] px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-900/5 sm:p-10">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white"><ShieldCheck size={22} /></div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Store Console</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
          {stage === "credentials" ? "Admin sign in" : stage === "email" ? "Confirm your email" : "Verify it’s you"}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {stage === "credentials" ? "Sign in to manage your storefront." : stage === "email" ? "Enter the email address where you want to receive a one-time code." : `Enter the 6-digit code sent to ${emailHint}.`}
        </p>

        {stage === "credentials" && (
          <form onSubmit={submitCredentials} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-zinc-700">Username<input name="username" autoComplete="username" required className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-500" placeholder="Enter username" /></label>
            <label className="block text-sm font-medium text-zinc-700">Password<input name="password" type="password" autoComplete="current-password" required className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-500" placeholder="Enter password" /></label>
            {error && <p role="alert" aria-live="polite" className="text-sm text-red-600">{error}</p>}
            <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-60"><LockKeyhole size={16} />{pending ? "Checking details…" : "Continue"}</button>
          </form>
        )}

        {stage === "email" && (
          <form onSubmit={sendOtp} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-zinc-700">Send code to<input name="email" type="email" autoComplete="email" required value={enteredEmail} onChange={(event) => setEnteredEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-500" placeholder="Enter recipient email" /></label>
            {error && <p role="alert" aria-live="polite" className="text-sm text-red-600">{error}</p>}
            <button disabled={pending || !enteredEmail.trim()} className="w-full rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Sending code…" : "Send email verification code"}</button>
            <button type="button" onClick={() => { setStage("credentials"); setError(""); }} className="w-full text-sm text-zinc-500 hover:text-zinc-900">Back to sign in</button>
          </form>
        )}

        {stage === "otp" && (
          <form onSubmit={verifyOtp} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-zinc-700">Verification code<input name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none focus:border-zinc-500" placeholder="000000" /></label>
            {error && <p role="alert" aria-live="polite" className="text-sm text-red-600">{error}</p>}
            <button disabled={pending} className="w-full rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Verifying…" : "Verify and continue"}</button>
            <button type="button" disabled={pending || secondsLeft > 0} onClick={() => void sendOtp()} className="w-full text-sm text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:text-zinc-400">{secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : "Resend code"}</button>
            <button type="button" onClick={() => { setStage("email"); setError(""); }} className="w-full text-sm text-zinc-500 hover:text-zinc-900">Change email address</button>
            <button type="button" onClick={() => { setStage("credentials"); setError(""); }} className="w-full text-sm text-zinc-500 hover:text-zinc-900">Back to sign in</button>
          </form>
        )}
      </section>
    </main>
  );
}
