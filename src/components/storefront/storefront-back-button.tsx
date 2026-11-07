"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StorefrontBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Go back"
      title="Go back"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-[#d5aa42] hover:text-[#f4c95d]"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
