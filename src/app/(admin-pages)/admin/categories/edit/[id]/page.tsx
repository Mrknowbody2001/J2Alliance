import { requireAdmin } from "@/lib/admin-auth";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin-components/category-form";
import { getCategoryById } from "@/services/category.service";

export const dynamic = "force-dynamic";

type EditCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  await requireAdmin();
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Edit Category</h1>
        <p className="text-sm text-zinc-500">
          Update the main category details.
        </p>
      </div>
      <CategoryForm
        categoryId={category.id}
        initialData={{
          name: category.name,
        }}
      />
    </div>
  );
}
