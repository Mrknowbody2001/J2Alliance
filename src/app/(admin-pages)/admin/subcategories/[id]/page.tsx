import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubCategoryById } from "@/services/subcategory.service";

export const dynamic = "force-dynamic";

type SubCategoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SubCategoryDetailPage({
  params,
}: SubCategoryDetailPageProps) {
  const { id } = await params;
  const subcategory = await getSubCategoryById(id);

  if (!subcategory) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Sub Category Details</p>
          <h1 className="text-3xl font-semibold text-zinc-900">
            {subcategory.name}
          </h1>
        </div>
        <Link
          href={`/admin/subcategories/edit/${subcategory.id}`}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
        >
          Edit Sub Category
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Sub Category ID</h2>
            <p className="mt-2 break-all text-sm text-zinc-600">{subcategory.id}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Main Category</h2>
            <p className="mt-2 text-sm text-zinc-600">{subcategory.category.name}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Collection Image</h2>
            {subcategory.imageUrl ? <img src={subcategory.imageUrl} alt={subcategory.name} className="mt-2 h-24 w-24 rounded-full object-cover" /> : <p className="mt-2 text-sm text-zinc-600">No image uploaded.</p>}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Main Category ID</h2>
            <p className="mt-2 break-all text-sm text-zinc-600">
              {subcategory.category.id}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Created</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {new Date(subcategory.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Updated</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {new Date(subcategory.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
