import { requireAdmin } from "@/lib/admin-auth";
import CategoryForm from "@/components/admin-components/category-form";

export default async function CreateCategoryPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Create Category</h1>
        <p className="text-sm text-zinc-500">
          Add a new main category to group your catalog sections.
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
