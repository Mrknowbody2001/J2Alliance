import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
          Admin Overview
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500">
          Quick links to manage your catalog and set up the storefront.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Products</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Add or edit product details, pricing, and SEO tags.
          </p>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline"
          >
            View products
          </Link>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Homepage Hero</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Manage hero image scroller slides, update slide copy, and remove old banners.
          </p>
          <Link
            href="/admin/hero"
            className="mt-4 inline-flex items-center text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline"
          >
            Manage hero slides
          </Link>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Gallery</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Manage your gallery, control how many homepage images you want, and
            set where each image should redirect.
          </p>
          <Link
            href="/admin/gallery"
            className="mt-4 inline-flex items-center text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline"
          >
            Manage your gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
