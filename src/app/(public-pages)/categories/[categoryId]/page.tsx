import { notFound } from "next/navigation";
import StorefrontCategoryPage from "@/components/storefront/storefront-category-page";
import {
  getCategoryWithSubCategories,
  listCategoriesWithSubCategories,
} from "@/services/category.service";
import { listProductsByCategory } from "@/services/product.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function MainCategoryPage({ params }: PageProps) {
  const { categoryId } = await params;
  const [category, categories, products] = await Promise.all([
    getCategoryWithSubCategories(categoryId),
    listCategoriesWithSubCategories(),
    listProductsByCategory(categoryId),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <StorefrontCategoryPage
      activeSubCategoryId={null}
      basePath={`/categories/${category.id}`}
      categories={categories.map((item) => ({ id: item.id, name: item.name, subcategories: item.subcategories.map((subcategory) => ({ id: subcategory.id, name: subcategory.name })) }))}
      categoryName={category.name}
      subcategories={category.subcategories}
      products={products.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.thumbnail ?? product.images[0] ?? null,
        categoryName: product.category.name,
        subCategoryName: product.subCategory.name,
      }))}
    />
  );
}
