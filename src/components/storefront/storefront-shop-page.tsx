"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  ProductCard,
  SectionHeading,
  StorefrontFooter,
  StorefrontHeader,
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

type ShopProduct = ShellProduct & {
  categoryId: string;
  subCategoryId: string;
};

type StorefrontShopPageProps = {
  categories: CategoryItem[];
  products: ShopProduct[];
};

export default function StorefrontShopPage({ categories, products }: StorefrontShopPageProps) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const activeCategory = categories.find((category) => category.id === categoryId);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.categoryName?.toLowerCase().includes(term) ||
        product.subCategoryName?.toLowerCase().includes(term);
      const matchesCategory = !categoryId || product.categoryId === categoryId;
      const matchesSubCategory = !subCategoryId || product.subCategoryId === subCategoryId;

      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [categoryId, products, search, subCategoryId]);

  const navCategories = categories;

  return (
    <main className="min-h-screen bg-white text-[#111]">
      <StorefrontHeader categories={navCategories} />

      <section className="bg-[#111] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[#d5aa42]">
            Shop
          </p>
          <h1 className="font-heading mt-3 text-5xl font-semibold leading-[0.95] text-white sm:text-7xl">
            Explore the Collection
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/62">
            Search and filter live products from the existing JS Pvt Ltd catalog.
          </p>
        </div>
      </section>

      <section className="border-b border-[#eee7da] bg-[#faf8f2]">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-10">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="h-12 w-full rounded-md border border-[#e2d8c7] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#d5aa42]"
            />
          </label>

          <select
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setSubCategoryId("");
            }}
            className="h-12 rounded-md border border-[#e2d8c7] bg-white px-4 text-sm outline-none transition focus:border-[#d5aa42]"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={subCategoryId}
            onChange={(event) => setSubCategoryId(event.target.value)}
            disabled={!activeCategory}
            className="h-12 rounded-md border border-[#e2d8c7] bg-white px-4 text-sm outline-none transition focus:border-[#d5aa42] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">All subcategories</option>
            {activeCategory?.subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Products"
            title={`${filteredProducts.length} item${filteredProducts.length === 1 ? "" : "s"} found`}
          />
          <p className="text-sm text-[#686868]">Sorted by latest catalog update.</p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-[#d8ceb9] bg-[#faf8f2] p-8 text-sm leading-7 text-[#686868]">
            No products match this filter yet.
          </div>
        )}
      </section>

      <StorefrontFooter categories={navCategories} />
    </main>
  );
}
