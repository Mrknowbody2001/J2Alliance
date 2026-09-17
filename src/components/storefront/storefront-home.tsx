"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  SectionHeading,
  StorefrontFooter,
  StorefrontHeader,
  formatPrice,
  type ShellProduct,
} from "@/components/storefront/storefront-shell";

type CategoryItem = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};

type GalleryItem = {
  id: string;
  imageUrl: string;
  categoryName: string;
  href: string;
};

type ProductItem = ShellProduct & {
  description: string;
};

type HeroSlide = {
  id: string;
  imageUrl: string;
  eyebrow: string | null;
  title: string;
  copy: string | null;
};

type StorefrontHomeProps = {
  categories: CategoryItem[];
  galleryItems: GalleryItem[];
  heroSlides: HeroSlide[];
  products: ProductItem[];
};

const fallbackHeroSlides = [
  {
    id: "fallback-hero-1",
    imageUrl: "/image/hero-banner-01.png",
    eyebrow: "Online Store",
    title: "J2Alliance",
    copy: "Explore curated gems, hand crafts, home accents, Swiss watches, and new arrivals in one place.",
  },
  {
    id: "fallback-hero-2",
    imageUrl: "/image/hero-banner-02.png",
    eyebrow: "Fresh Collections",
    title: "Find your next favorite",
    copy: "Browse products by category and jump straight into the newest catalog updates.",
  },
  {
    id: "fallback-hero-3",
    imageUrl: "/image/hearo-banner-03.png",
    eyebrow: "Modern E-Commerce",
    title: "Shop what is new",
    copy: "Hero slides, categories, gallery images, and products stay connected to your admin dashboard.",
  },
];

export default function StorefrontHome({
  categories,
  galleryItems,
  heroSlides,
  products,
}: StorefrontHomeProps) {
  const visibleHeroSlides =
    heroSlides.length > 0 ? heroSlides : fallbackHeroSlides;
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (visibleHeroSlides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % visibleHeroSlides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [visibleHeroSlides.length]);

  const activeHeroSlide = activeSlide % visibleHeroSlides.length;

  const trendingProducts = useMemo(() => {
    const rotated = [...products.slice(4), ...products.slice(0, 4)];
    return rotated.slice(0, 8);
  }, [products]);

  const latestProducts = products.slice(0, 8);

  const navCategories = categories;

  return (
    <main className="min-h-screen bg-white text-[#111]">
      <StorefrontHeader categories={navCategories} />

      <section className="relative bg-[#080808] text-white">
        <div className="relative h-[calc(100vh-73px)] min-h-[34rem] overflow-hidden lg:min-h-[42rem]">
          {visibleHeroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeHeroSlide === index
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.52)_42%,rgba(0,0,0,0.1)_100%)]" />
              <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-10">
                <div className="max-w-2xl pt-6">
                  {slide.eyebrow && (
                    <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#f4c95d]">
                      {slide.eyebrow}
                    </p>
                  )}
                  <h1 className="font-heading mt-5 text-6xl font-semibold leading-[0.92] text-white sm:text-7xl lg:text-8xl">
                    {slide.title}
                  </h1>
                  {slide.copy && (
                    <p className="mt-6 max-w-xl text-base leading-8 text-white/74 sm:text-lg">
                      {slide.copy}
                    </p>
                  )}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#d5aa42] px-7 text-sm font-bold uppercase tracking-[0.16em] text-[#111] transition hover:bg-[#f4c95d]"
                    >
                      Shop Now
                    </Link>
                    <Link
                      href="#categories"
                      className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/22 px-7 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-[#f4c95d] hover:text-[#f4c95d]"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-6 left-4 right-4 mx-auto flex max-w-7xl items-center justify-between sm:left-6 sm:right-6 lg:left-10 lg:right-10">
            <div className="flex items-center gap-2">
              {visibleHeroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    activeHeroSlide === index
                      ? "w-10 bg-[#d5aa42]"
                      : "w-2 bg-white/45"
                  }`}
                  aria-label={`Open ${slide.title}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (current) =>
                      (current - 1 + visibleHeroSlides.length) %
                      visibleHeroSlides.length,
                  )
                }
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/24 text-white backdrop-blur transition hover:border-[#d5aa42] hover:text-[#f4c95d]"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (current) => (current + 1) % visibleHeroSlides.length,
                  )
                }
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-black/24 text-white backdrop-blur transition hover:border-[#d5aa42] hover:text-[#f4c95d]"
                aria-label="Next banner"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#111] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
              Trending Products
            </p>
            <h2 className="font-heading mt-3 text-4xl font-semibold leading-[0.98] text-white sm:text-5xl">
              Popular Picks
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              A quick look at products worth highlighting from the current
              catalog.
            </p>
          </div>
          <CompactProductRow
            products={trendingProducts}
            emptyMessage="Add products from admin to populate trending products."
            dark
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Latest Products"
            title="New Arrivals"
            copy="Fresh products from the catalog, shown with their original product images."
          />
          <Link
            href="/shop"
            className="text-sm font-bold uppercase tracking-[0.16em] text-[#9d7415] hover:text-[#111]"
          >
            View Shop
          </Link>
        </div>
        <CompactProductRow
          products={latestProducts}
          emptyMessage="No products yet. Add products from admin and they will appear here automatically."
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-8">
          <SectionHeading
            eyebrow="Our Gallery"
            title="Curated Visual Stories"
            copy="Gallery images remain controlled by the existing admin dashboard and always render as a two-column layout on desktop."
          />
        </div>
        {galleryItems.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {galleryItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group relative block overflow-hidden rounded-md bg-[#f5f2eb]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.categoryName}
                  className="aspect-[16/11] w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 to-transparent p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f4c95d]">
                    View Collection
                  </p>
                  <h3 className="font-heading mt-2 text-3xl font-semibold">
                    {item.categoryName}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState message="No gallery images yet. Add them from the admin dashboard and this section will appear automatically." />
        )}
      </section>

      <StorefrontFooter categories={navCategories} />
    </main>
  );
}

function CompactProductRow({
  products,
  emptyMessage,
  dark = false,
}: {
  products: ShellProduct[];
  emptyMessage: string;
  dark?: boolean;
}) {
  if (products.length === 0) {
    return <EmptyState dark={dark} message={emptyMessage} />;
  }

  return (
    <div className="scrollbar-none flex gap-4 overflow-x-auto scroll-smooth pb-2">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className={`group flex min-h-28 min-w-[13.5rem] flex-col justify-between rounded-md border p-4 transition hover:-translate-y-0.5 sm:min-w-[calc((100%-3rem)/4)] ${
            dark
              ? "border-white/12 bg-white/[0.04] text-white hover:border-[#d5aa42] hover:bg-white/[0.07]"
              : "border-[#e7e2d8] bg-white text-[#111] shadow-[0_14px_34px_rgba(0,0,0,0.05)] hover:border-[#d5aa42] hover:shadow-[0_20px_42px_rgba(0,0,0,0.1)]"
          }`}
        >
          <h3
            className={`line-clamp-2 text-sm font-semibold leading-6 ${
              dark ? "text-white" : "text-[#111]"
            }`}
          >
            {product.title}
          </h3>
          <p
            className={`mt-4 text-sm font-bold ${
              dark ? "text-[#f4c95d]" : "text-[#9d7415]"
            }`}
          >
            {formatPrice(product.price)}
          </p>
        </Link>
      ))}
    </div>
  );
}

function EmptyState({
  message,
  dark = false,
}: {
  message: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-md border border-dashed p-8 text-sm leading-7 ${
        dark
          ? "border-white/18 bg-white/[0.04] text-white/62 sm:col-span-2 lg:col-span-4"
          : "border-[#d8ceb9] bg-[#faf8f2] text-[#686868]"
      }`}
    >
      {message}
    </div>
  );
}
