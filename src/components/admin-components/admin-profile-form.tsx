"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Camera, CircleUserRound, KeyRound, Save } from "lucide-react";

type Profile = { username: string; imageUrl: string | null };
export default function AdminProfileForm() {
  const [profile, setProfile] = useState<Profile>({ username: "admin", imageUrl: null });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { fetch("/api/admin/profile").then((r) => r.json()).then((data) => { if (data.username) setProfile(data); }).catch(() => setError("Could not load profile.")); }, []);
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...profile, password }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setProfile(data); setPassword(""); setMessage("Profile updated successfully.");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to save changes."); }
    finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setError(""); setMessage("");
    try {
      const form = new FormData(); form.append("file", file);
      const response = await fetch("/api/uploads/profile-image", { method: "POST", body: form });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setProfile((current) => ({ ...current, imageUrl: data.secureUrl })); setMessage("Image uploaded. Save profile to keep it.");
    } catch (e) { setError(e instanceof Error ? e.message : "Image upload failed."); }
    finally { setBusy(false); }
  }
  return <div className="mx-auto max-w-3xl space-y-7">
    <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">Account</p><h1 className="mt-2 text-3xl font-semibold text-zinc-900">Profile & security</h1><p className="mt-2 text-sm text-zinc-500">Update the account details used to access your admin dashboard.</p></div>
    <form onSubmit={save} className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:p-8">
      <section className="flex flex-wrap items-center gap-5 border-b border-zinc-100 pb-7"><div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-zinc-400">{profile.imageUrl ? <img src={profile.imageUrl} alt="Admin profile" className="h-full w-full object-cover" /> : <CircleUserRound size={42} />}</div><div><h2 className="font-semibold text-zinc-900">Profile image</h2><p className="mt-1 text-sm text-zinc-500">JPG, PNG, or WebP image.</p><label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium hover:bg-zinc-50"><Camera size={15} />Upload image<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} /></label></div></section>
      <label className="block text-sm font-medium text-zinc-700">Username<input value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} required minLength={3} maxLength={40} className="mt-2 w-full max-w-lg rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-500" /></label>
      <section className="border-t border-zinc-100 pt-6"><div className="mb-4 flex items-center gap-2"><KeyRound size={17} className="text-zinc-500" /><h2 className="font-semibold text-zinc-900">Change password</h2></div><label className="block text-sm font-medium text-zinc-700">New password<input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} placeholder="Leave blank to keep current password" className="mt-2 w-full max-w-lg rounded-xl border border-zinc-200 px-4 py-3 outline-none focus:border-zinc-500" /></label><p className="mt-2 text-xs text-zinc-400">Use at least 8 characters. The default password is temporary; change it here.</p></section>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}{message && <p role="status" className="text-sm text-emerald-700">{message}</p>}
      <button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-60"><Save size={16} />{busy ? "Saving…" : "Save changes"}</button>
    </form>
  </div>;
}
