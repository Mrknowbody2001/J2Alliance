"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AtSign,
  ChevronDown,
  Globe,
  Heart,
  Share2,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

export type ShellCategory = {
  id: string;
  name: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};

export type ShellProduct = {
  id: string;
  title: string;
  price: number;
  image: string | null;
  categoryName?: string;
  subCategoryName?: string;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 2,
});

export function formatPrice(price: number) {
  return currency.format(price);
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function StorefrontHeader({
  categories = [],
}: {
  categories?: ShellCategory[];
}) {
  const [open, setOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeCategoryMenu(event: MouseEvent) {
      if (!categoryMenuRef.current?.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsCategoryMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", closeCategoryMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeCategoryMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function toggleCategoryMenu() {
    setIsCategoryMenuOpen((isOpen) => !isOpen);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080808] text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-fit flex-col leading-none">
          <span className="font-heading text-3xl font-semibold tracking-[0.08em]">
            J2Alliance
          </span>
          <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#d5aa42]">
            Online Store
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/78 transition hover:text-[#f4c95d]"
            >
              {item.label}
            </Link>
          ))}
          {categories.length > 0 && (
            <div ref={categoryMenuRef} className="relative">
              <button
                type="button"
                onClick={toggleCategoryMenu}
                className="inline-flex items-center gap-1 text-sm font-medium text-white/78 transition hover:text-[#f4c95d]"
                aria-expanded={isCategoryMenuOpen}
                aria-controls="desktop-category-menu"
              >
                Categories
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isCategoryMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isCategoryMenuOpen && (
                <div
                  id="desktop-category-menu"
                  className="absolute right-0 top-[calc(100%+1.15rem)] w-72 overflow-hidden rounded-md border border-white/12 bg-[#111] p-2 shadow-[0_18px_42px_rgba(0,0,0,0.34)]"
                >
                  <p className="px-3 pb-2 pt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/42">
                    Categories
                  </p>
                  <div className="grid gap-1">
                    {categories.map((category) => {
                      const isExpanded = category.id === activeCategoryId;

                      return (
                        <div
                          key={category.id}
                          className="rounded-sm bg-white/[0.03]"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setActiveCategoryId((current) =>
                                current === category.id ? null : category.id,
                              )
                            }
                            className="flex min-h-11 w-full items-center justify-between gap-3 px-3 text-left text-sm font-semibold text-white/82 transition hover:bg-white/8 hover:text-[#f4c95d]"
                            aria-expanded={isExpanded}
                          >
                            <span>{category.name}</span>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="mb-2 ml-4 grid gap-1 border-l border-white/12 pl-3">
                              {category.subcategories?.length ? (
                                category.subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    href={`/categories/${category.id}/${subcategory.id}`}
                                    onClick={() => setIsCategoryMenuOpen(false)}
                                    className="rounded-sm px-2 py-2 text-sm text-white/65 transition hover:bg-white/8 hover:text-[#f4c95d]"
                                  >
                                    {subcategory.name}
                                  </Link>
                                ))
                              ) : (
                                <p className="px-2 py-2 text-sm text-white/48">
                                  No subcategories yet.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {navItems.slice(2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/78 transition hover:text-[#f4c95d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {[
            { Icon: Search, label: "Search" },
            { Icon: Heart, label: "Wishlist" },
            { Icon: ShoppingBag, label: "Cart" },
            { Icon: User, label: "Account" },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-[#d5aa42] hover:text-[#f4c95d] sm:inline-flex"
              aria-label={label}
              title={label}
            >
              <Icon className="h-4.5 w-4.5" />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white transition hover:border-[#d5aa42] hover:text-[#f4c95d] lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden">
          <aside className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-[#101010] p-5 text-white shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#d5aa42]">
                  Menu
                </p>
                <p className="font-heading mt-1 text-3xl">J2Alliance</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/6"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-white/8 px-4 py-3 text-sm font-semibold text-white/85 transition hover:border-[#d5aa42] hover:text-[#f4c95d]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {categories.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  Categories
                </p>
                <div className="grid gap-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="rounded-md bg-white/[0.04] p-1"
                    >
                      <Link
                        href={`/categories/${category.id}`}
                        onClick={() => setOpen(false)}
                        className="block px-3 py-2 text-sm font-semibold text-white/90 transition hover:text-[#f4c95d]"
                      >
                        {category.name}
                      </Link>
                      {category.subcategories &&
                        category.subcategories.length > 0 && (
                          <div className="mb-1 ml-3 grid gap-1 border-l border-white/10 pl-3">
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                href={`/categories/${category.id}/${subcategory.id}`}
                                onClick={() => setOpen(false)}
                                className="py-1.5 text-xs text-white/58 transition hover:text-[#f4c95d]"
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"
      }
    >
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#b58518]">
        {eyebrow}
      </p>
      <h2 className="font-heading mt-3 text-4xl font-semibold leading-[0.98] text-[#111] sm:text-5xl">
        {title}
      </h2>
      {copy && (
        <p className="mt-4 text-sm leading-7 text-[#5d5d5d] sm:text-base">
          {copy}
        </p>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: ShellProduct }) {
  return (
    <article className="group overflow-hidden rounded-md border border-[#e7e2d8] bg-white shadow-[0_18px_42px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#d5aa42] hover:shadow-[0_24px_54px_rgba(0,0,0,0.12)]">
      <Link
        href={`/products/${product.id}`}
        className="block overflow-hidden bg-[#f5f2eb]"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center text-xs font-semibold uppercase tracking-[0.24em] text-[#8d8d8d]">
            Product Image
          </div>
        )}
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="min-h-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#b58518]">
              {product.subCategoryName ?? product.categoryName ?? "Collection"}
            </p>
            <Link href={`/products/${product.id}`}>
              <h3 className="mt-2 line-clamp-2 text-base font-semibold text-[#111] transition hover:text-[#9d7415]">
                {product.title}
              </h3>
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e6dfd0] text-[#111] transition hover:border-[#d5aa42] hover:bg-[#fff8e3]"
            aria-label="Add to wishlist"
            title="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#eee9df] pt-3">
          <p className="text-sm font-bold text-[#111]">
            {formatPrice(product.price)}
          </p>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center justify-center rounded-md bg-[#111] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#d5aa42] hover:text-[#111]"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StorefrontFooter({
  categories = [],
}: {
  categories?: ShellCategory[];
}) {
  const footerCategories =
    categories.length > 0
      ? categories
      : [
          { id: "gems", name: "Gems" },
          { id: "hand-crafts", name: "Hand Crafts" },
          { id: "home-accessories", name: "Home Accessories" },
          { id: "swiss-watches", name: "Swiss Watches" },
        ];

  return (
    <footer className="bg-[#080808] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="font-heading text-4xl font-semibold tracking-[0.06em]">
            J2Alliance
          </p>
          <p className="mt-4 text-sm leading-7 text-white/58">
            Shop gems, hand crafts, home accessories, Swiss watches, and fresh
            catalog arrivals.
          </p>
          <div className="mt-5 flex gap-2">
            {[Globe, AtSign, Share2].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/72 transition hover:border-[#d5aa42] hover:text-[#f4c95d]"
                aria-label="Social media"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <FooterColumn
          title="Company"
          links={[
            { label: "About Us", href: "/about" },
            { label: "Contact", href: "/contact" },
            { label: "Privacy Policy", href: "#" },
            { label: "Terms & Conditions", href: "#" },
          ]}
        />
        <FooterColumn
          title="Customer Service"
          links={[
            { label: "Contact Us", href: "/contact" },
            { label: "Shipping", href: "#" },
            { label: "Returns", href: "#" },
            { label: "FAQs", href: "#" },
          ]}
        />
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-[#d5aa42]">
            Categories
          </h3>
          <div className="mt-4 grid gap-3">
            {footerCategories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={
                  category.id.length > 12
                    ? `/categories/${category.id}`
                    : "/shop"
                }
                className="text-sm text-white/62 transition hover:text-[#f4c95d]"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/45">
        (c) J2Alliance. All Rights Reserved.
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-[#d5aa42]">
        {title}
      </h3>
      <div className="mt-4 grid gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm text-white/62 transition hover:text-[#f4c95d]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
