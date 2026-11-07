import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import SubCategoryForm from "@/components/admin-components/subcategory-form";
import { listCategoriesBasic } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function CreateSubCategoryPage() {
  await requireAdmin();
  const categories = await listCategoriesBasic();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">
          Create Sub Category
        </h1>
        <p className="text-sm text-zinc-500">
          Add a sub category and map it to an existing main category.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-600">
          You need at least one main category first.{" "}
          <Link href="/admin/categories/create" className="font-medium underline">
            Create Category
          </Link>
        </div>
      ) : (
        <SubCategoryForm
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
          }))}
        />
      )}
    </div>
  );
}
