import { notFound } from "next/navigation";
import SubCategoryForm from "@/components/admin-components/subcategory-form";
import { listCategoriesBasic } from "@/services/category.service";
import { getSubCategoryById } from "@/services/subcategory.service";

export const dynamic = "force-dynamic";

type EditSubCategoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSubCategoryPage({
  params,
}: EditSubCategoryPageProps) {
  const { id } = await params;
  const [subcategory, categories] = await Promise.all([
    getSubCategoryById(id),
    listCategoriesBasic(),
  ]);

  if (!subcategory) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">
          Edit Sub Category
        </h1>
        <p className="text-sm text-zinc-500">
          Update sub category name or change its main category mapping.
        </p>
      </div>
      <SubCategoryForm
        subCategoryId={subcategory.id}
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
        }))}
        initialData={{
          name: subcategory.name,
          imageUrl: subcategory.imageUrl,
          categoryId: subcategory.categoryId,
        }}
      />
    </div>
  );
}
