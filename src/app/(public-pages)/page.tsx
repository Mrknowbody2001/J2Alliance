import type { Metadata } from "next";
import StorefrontHome from "@/components/storefront/storefront-home";
import { stripRichText } from "@/lib/rich-text";
import { listCategoriesWithSubCategories } from "@/services/category.service";
import { getGallerySection } from "@/services/gallery.service";
import { getHeroSection } from "@/services/hero.service";
import { listProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "J2Alliance | Online Store",
  description:
    "Shop gems, hand crafts, home accessories, and Swiss watches from J2Alliance.",
};

export default async function HomePage() {
  const [categories, gallery, hero, products] = await Promise.all([
    listCategoriesWithSubCategories(),
    getGallerySection(),
    getHeroSection(),
    listProducts(),
  ]);

  const categoryItems = categories.map((category) => ({
    id: category.id,
    name: category.name,
    subcategories: category.subcategories.map((subcategory) => ({
      id: subcategory.id,
      name: subcategory.name,
    })),
  }));

  const productItems = products.slice(0, 12).map((product) => ({
    id: product.id,
    title: product.title,
    description: stripRichText(product.description),
    price: product.price,
    image: product.thumbnail ?? product.images[0] ?? null,
    categoryName: product.category.name,
    subCategoryName: product.subCategory.name,
  }));

  const galleryItems = gallery.items.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    categoryName: item.category.name,
    href: `/categories/${item.categoryId}`,
  }));

  const heroSlides = hero.slides.map((slide) => ({
    id: slide.id,
    imageUrl: slide.imageUrl,
    eyebrow: slide.eyebrow,
    title: slide.title,
    copy: slide.copy,
  }));

  return (
    <StorefrontHome
      categories={categoryItems}
      galleryItems={galleryItems}
      heroSlides={heroSlides}
      products={productItems}
    />
  );
}
