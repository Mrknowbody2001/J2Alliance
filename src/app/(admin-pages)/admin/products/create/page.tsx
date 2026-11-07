import { requireAdmin } from "@/lib/admin-auth";
import ProductForm from "@/components/admin-components/product-form";
import { listCategoriesWithSubCategories } from "@/services/category.service";

export default async function CreateProductPage() {
  await requireAdmin();
  const categories = await listCategoriesWithSubCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Create Product</h1>
        <p className="text-sm text-zinc-500">
          Add the core details, assign the category, and organize the product.
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
