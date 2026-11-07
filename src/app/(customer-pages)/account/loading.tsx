export default function AccountLoading() {
  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-7 sm:py-10 lg:px-10">
        <div className="mb-8">
          <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-10 w-72 max-w-full animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-white/5" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="h-64 animate-pulse rounded-2xl border border-white/8 bg-[#101010]" />
          <div className="min-h-[560px] animate-pulse rounded-2xl border border-white/8 bg-[#101010]" />
        </div>
      </div>
    </main>
  );
}
