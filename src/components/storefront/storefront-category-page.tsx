/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import StorefrontBackButton from "@/components/storefront/storefront-back-button";
import {
  ProductCard,
  SectionHeading,
  StorefrontFooter,
  type ShellCategory,
  type ShellProduct,
} from "@/components/storefront/storefront-shell";

type SubCategoryItem = {
  id: string;
  name: string;
  imageUrl: string | null;
};

type StorefrontCategoryPageProps = {
  activeSubCategoryId: string | null;
  basePath: string;
  categories?: ShellCategory[];
  categoryName: string;
  products: ShellProduct[];
  subcategories: SubCategoryItem[];
};

export default function StorefrontCategoryPage({
  activeSubCategoryId,
  basePath,
  categories = [],
  categoryName,
  products,
  subcategories,
}: StorefrontCategoryPageProps) {
  return (
    <main className="min-h-screen bg-white text-[#111]">
      <section className="bg-[#111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10 sm:py-5">
          <div className="grid gap-3 lg:grid-cols-[1fr_0.72fr] lg:items-center">
            <div className="flex items-center gap-4">
              <StorefrontBackButton />
              <h1 className="font-heading text-4xl font-semibold leading-[0.95] text-white sm:text-6xl">
                {categoryName}
              </h1>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-white/62">
              Browse live products assigned to this category through the existing admin catalog.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#eee7da] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-10">
          <div className="scrollbar-none flex gap-5 overflow-x-auto pb-1">
            <Link
              href={basePath}
              className={`group flex w-24 shrink-0 flex-col items-center justify-center gap-3 text-center transition ${
                activeSubCategoryId === null
                  ? "text-[#111]"
                  : "text-[#777] hover:text-[#111]"
              }`}
            >
              <span className="py-7 text-xs font-bold uppercase tracking-[0.12em]">All {categoryName}</span>
            </Link>

            {subcategories.map((subcategory) => {
              const href = `${basePath}/${subcategory.id}`;
              const isActive = activeSubCategoryId === subcategory.id;

              return (
                <Link
                  key={subcategory.id}
                  href={href}
                  className={`group flex w-24 shrink-0 flex-col items-center gap-3 text-center transition ${isActive ? "text-[#111]" : "text-[#777] hover:text-[#111]"}`}
                >
                  <span className={`relative block aspect-square w-20 overflow-hidden rounded-full border bg-[#faf8f2] ${isActive ? "border-[#d5aa42] ring-2 ring-[#d5aa42]/30" : "border-[#e5ddcb] group-hover:border-[#d5aa42]"}`}>
                    {subcategory.imageUrl ? (
                      <img src={subcategory.imageUrl} alt={subcategory.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center px-2 text-center text-[0.6rem] font-bold uppercase tracking-[0.1em] text-[#8d8d8d]">{subcategory.name}</span>
                    )}
                  </span>
                  <span className="line-clamp-2 text-xs font-bold uppercase tracking-[0.1em]">{subcategory.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={activeSubCategoryId ? "Subcategory" : "Full Collection"}
            title={`${products.length} item${products.length === 1 ? "" : "s"} available`}
          />
          <Link href="/contact" className="text-sm font-bold uppercase tracking-[0.16em] text-[#9d7415] hover:text-[#111]">
            Need Help?
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-[#d8ceb9] bg-[#faf8f2] p-8 text-sm leading-7 text-[#686868]">
            No products are assigned to this view yet. Add products in admin and they will appear here automatically.
          </div>
        )}
      </section>

      <StorefrontFooter categories={categories} />
    </main>
  );
}
