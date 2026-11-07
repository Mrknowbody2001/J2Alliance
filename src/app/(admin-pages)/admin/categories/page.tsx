import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import CategoryTable from "@/components/admin-components/category-table";
import SubCategoryTable from "@/components/admin-components/subcategory-table";
import { listCategories } from "@/services/category.service";
import { listSubCategories } from "@/services/subcategory.service";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await requireAdmin();
  const [categories, subcategories] = await Promise.all([
    listCategories(),
    listSubCategories(),
  ]);

  const serializedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    subcategoryCount: category._count.subcategories,
  }));

  const serializedSubCategories = subcategories.map((subcategory) => ({
    id: subcategory.id,
    name: subcategory.name,
    categoryId: subcategory.categoryId,
    categoryName: subcategory.category.name,
    createdAt: subcategory.createdAt.toISOString(),
    updatedAt: subcategory.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">
            Category Management
          </h1>
          <p className="text-sm text-zinc-500">
            Create and manage main categories and sub categories in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/categories/create"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Create Category
          </Link>
          <Link
            href="/admin/subcategories/create"
            className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            Create Sub Category
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Categories</h2>
        <CategoryTable categories={serializedCategories} />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Sub Categories</h2>
        <SubCategoryTable subcategories={serializedSubCategories} />
      </div>
    </div>
  );
}
