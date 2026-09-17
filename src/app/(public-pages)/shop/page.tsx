import type { Metadata } from "next";
import StorefrontShopPage from "@/components/storefront/storefront-shop-page";
import { listCategoriesWithSubCategories } from "@/services/category.service";
import { listProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop | JS Pvt Ltd",
  description: "Browse JS Pvt Ltd products across gems, hand crafts, home accessories, and Swiss watches.",
};

export default async function ShopPage() {
  const [categories, products] = await Promise.all([
    listCategoriesWithSubCategories(),
    listProducts(),
  ]);

  return (
    <StorefrontShopPage
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        subcategories: category.subcategories,
      }))}
      products={products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.thumbnail ?? product.images[0] ?? null,
        categoryId: product.categoryId,
        categoryName: product.category.name,
        subCategoryId: product.subCategoryId,
        subCategoryName: product.subCategory.name,
      }))}
    />
  );
}
