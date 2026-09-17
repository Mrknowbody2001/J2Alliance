/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Minus, Plus, ShoppingBag, ShieldCheck } from "lucide-react";
import RichTextContent from "@/components/ui/rich-text-content";
import {
  formatPrice,
  StorefrontFooter,
  StorefrontHeader,
} from "@/components/storefront/storefront-shell";
import { listCategoriesWithSubCategories } from "@/services/category.service";
import { getProductById } from "@/services/product.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product | JS Pvt Ltd" };
  }

  return {
    title: `${product.seoTitle || product.title} | JS Pvt Ltd`,
    description: product.seoDesc || `View ${product.title} at JS Pvt Ltd.`,
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    listCategoriesWithSubCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const navCategories = categories;
  const images = product.images.length > 0 ? product.images : product.thumbnail ? [product.thumbnail] : [];
  const primaryImage = product.thumbnail ?? images[0] ?? null;

  return (
    <main className="min-h-screen bg-white text-[#111]">
      <StorefrontHeader categories={navCategories} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <Link
          href={`/categories/${product.categoryId}`}
          className="text-xs font-bold uppercase tracking-[0.22em] text-[#9d7415] transition hover:text-[#111]"
        >
          Back to {product.category.name}
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="grid gap-4 lg:grid-cols-[92px_1fr]">
            <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
              {(images.length > 0 ? images : [primaryImage]).map((image, index) =>
                image ? (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    className="h-20 w-20 shrink-0 rounded-md border border-[#e5ddcb] object-cover"
                  />
                ) : null
              )}
            </div>
            <div className="order-1 overflow-hidden rounded-md bg-[#f5f2eb] lg:order-2">
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product.title}
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-xs font-semibold uppercase tracking-[0.24em] text-[#8d8d8d]">
                  Product Image
                </div>
              )}
            </div>
          </div>

          <div className="lg:pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b58518]">
              {product.category.name} / {product.subCategory.name}
            </p>
            <h1 className="font-heading mt-3 text-5xl font-semibold leading-[0.96] text-[#111] sm:text-6xl">
              {product.title}
            </h1>
            <p className="mt-5 text-2xl font-bold text-[#111]">{formatPrice(product.price)}</p>

            <div className="mt-7 rounded-md border border-[#e7e2d8] bg-[#faf8f2] p-5">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#111]">
                <ShieldCheck className="h-5 w-5 text-[#b58518]" />
                <span>Availability: Contact store to confirm current stock</span>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex h-12 items-center overflow-hidden rounded-md border border-[#e2d8c7]">
                <button type="button" className="inline-flex h-12 w-12 items-center justify-center text-[#555]" aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="inline-flex h-12 w-12 items-center justify-center border-x border-[#e2d8c7] text-sm font-bold">
                  1
                </span>
                <button type="button" className="inline-flex h-12 w-12 items-center justify-center text-[#555]" aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#d5aa42] px-7 text-sm font-bold uppercase tracking-[0.14em] text-[#111] transition hover:bg-[#f4c95d]"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#e2d8c7] px-5 text-sm font-bold uppercase tracking-[0.14em] transition hover:border-[#d5aa42] hover:bg-[#fff8e3]"
              >
                <Heart className="h-4 w-4" />
                Favorite
              </button>
            </div>

            <div className="mt-8 border-t border-[#eee7da] pt-8">
              <h2 className="text-lg font-bold text-[#111]">Product Information</h2>
              <RichTextContent
                content={product.description}
                className="mt-4 text-sm leading-8 text-[#5d5d5d]"
                emptyMessage="Product description will appear here once added from admin."
              />
            </div>
          </div>
        </div>
      </section>

      <StorefrontFooter categories={navCategories} />
    </main>
  );
}
