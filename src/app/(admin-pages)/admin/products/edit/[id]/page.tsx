import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin-components/product-form";
import { listCategoriesWithSubCategories } from "@/services/category.service";
import { getProductById } from "@/services/product.service";

export const dynamic = "force-dynamic";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    listCategoriesWithSubCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Edit Product</h1>
        <p className="text-sm text-zinc-500">
          Update pricing, product details, and category placement.
        </p>
      </div>
      <ProductForm
        productId={product.id}
        categories={categories}
        initialData={{
          title: product.title,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          subCategoryId: product.subCategoryId,
          seoTags: product.seoTags ?? "",
          images: product.images,
          thumbnail: product.thumbnail ?? null,
        }}
      />
    </div>
  );
}
