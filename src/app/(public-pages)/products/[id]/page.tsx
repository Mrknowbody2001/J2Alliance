/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, Globe2, MapPin, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import RichTextContent from "@/components/ui/rich-text-content";
import ProductPurchaseControls from "@/components/storefront/product-purchase-controls";
import { StorefrontFooter, StorefrontHeader } from "@/components/storefront/storefront-shell";
import { listCategoriesWithSubCategories } from "@/services/category.service";
import { getProductById } from "@/services/product.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 2,
  }).format(price);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Product | J2Alliance" };
  }

  return {
    title: `${product.seoTitle || product.title} | J2Alliance`,
    description: product.seoDesc || `View ${product.title} at J2Alliance.`,
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
  const images =
    product.images.length > 0
      ? product.images
      : product.thumbnail
        ? [product.thumbnail]
        : [];
  const primaryImage = product.thumbnail ?? images[0] ?? null;

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <StorefrontHeader categories={navCategories} />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/55">
          <Link href={`/categories/${product.categoryId}`} className="text-[#1689a8] hover:underline">{product.category.name}</Link>
          <span aria-hidden="true" className="text-white/30">›</span>
          <Link href={`/categories/${product.categoryId}/${product.subCategoryId}`} className="text-[#1689a8] hover:underline">{product.subCategory.name}</Link>
          <span aria-hidden="true" className="text-white/30">›</span>
          <span aria-current="page" className="line-clamp-1">{product.title}</span>
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(250px,0.8fr)]">
          <div className="min-w-0">
            <div className="flex aspect-square max-h-[520px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-[#1c1c1c] p-4">
              {primaryImage ? (
                <img src={primaryImage} alt={product.title} className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8d8d8d]">Product Image</span>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${product.title} image ${index + 1}`} className="h-16 w-16 shrink-0 rounded border border-white/10 bg-[#1c1c1c] object-contain p-1 sm:h-20 sm:w-20" />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-white/10 bg-[#1b1b1b] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d5aa42]">{product.category.name} · {product.subCategory.name}</p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight text-white sm:text-3xl">{product.title}</h1>
            <p className="mt-4 text-2xl font-bold text-[#f4c95d]">{formatPrice(product.price)}</p>

            <ProductPurchaseControls
              product={{ id: product.id, title: product.title, price: product.price, image: primaryImage }}
            />

            <div className="mt-5 border-t border-white/10 pt-5">
              <h2 className="font-semibold text-white">Product details</h2>
              <RichTextContent content={product.description} className="mt-1 text-sm leading-5 text-white/65 [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_p]:!text-white/65 [&_li]:!text-white/65" emptyMessage="Product description will appear here once added from admin." />
            </div>
          </div>

          <aside className="divide-y divide-white/10 rounded-lg border border-white/10 bg-[#1b1b1b]">
            <div className="p-5">
              <h2 className="mb-4 font-semibold text-white">Delivery options</h2>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#d5aa42]" /><div><p className="font-medium text-white">Ships from Sri Lanka</p><p className="mt-1 text-white/55">Local delivery available islandwide</p></div></div>
                <div className="flex gap-3"><Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-[#d5aa42]" /><div><p className="font-medium text-white">Worldwide delivery</p><p className="mt-1 text-white/55">International delivery can be arranged</p></div></div>
                <div className="flex gap-3"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#d5aa42]" /><div><p className="font-medium text-white">Delivery fee confirmed at checkout</p><p className="mt-1 text-white/55">Timing depends on destination</p></div></div>
                <div className="flex gap-3"><Banknote className="mt-0.5 h-5 w-5 shrink-0 text-[#d5aa42]" /><p className="font-medium text-white">Cash on delivery available for local orders</p></div>
              </div>
            </div>
            <div className="p-5">
              <h2 className="mb-4 font-semibold text-white">Returns & warranty</h2>
              <div className="flex gap-3 text-sm"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#d5aa42]" /><p className="leading-6 text-white/65">Contact us for warranty and return details for this product.</p></div>
              <div className="mt-4 flex gap-3 text-sm"><PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#d5aa42]" /><p className="leading-6 text-white/65">We will confirm product availability before dispatch.</p></div>
            </div>
          </aside>
        </div>
      </section>

      <StorefrontFooter categories={navCategories} />
    </main>
  );
}
