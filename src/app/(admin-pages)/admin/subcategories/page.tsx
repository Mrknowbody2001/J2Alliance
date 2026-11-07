import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import SubCategoryTable from "@/components/admin-components/subcategory-table";
import { listSubCategories } from "@/services/subcategory.service";

export const dynamic = "force-dynamic";

export default async function SubCategoriesPage() {
  await requireAdmin();
  const subcategories = await listSubCategories();

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
          <h1 className="text-3xl font-semibold text-zinc-900">Sub Categories</h1>
          <p className="text-sm text-zinc-500">
            Manage sub categories and their mapped main category.
          </p>
        </div>
        <Link
          href="/admin/subcategories/create"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Create Sub Category
        </Link>
      </div>
      <SubCategoryTable subcategories={serializedSubCategories} />
    </div>
  );
}
