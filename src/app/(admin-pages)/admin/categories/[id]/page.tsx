import { requireAdmin } from "@/lib/admin-auth";
import type { SubCategory } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/services/category.service";

export const dynamic = "force-dynamic";

type CategoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  await requireAdmin();
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Category Details</p>
          <h1 className="text-3xl font-semibold text-zinc-900">{category.name}</h1>
        </div>
        <Link
          href={`/admin/categories/edit/${category.id}`}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
        >
          Edit Category
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Category ID</h2>
            <p className="mt-2 break-all text-sm text-zinc-600">{category.id}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Created</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {new Date(category.createdAt).toLocaleString()}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Updated</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {new Date(category.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-zinc-900">Sub Categories</h2>
          {category.subcategories.length === 0 ? (
            <p className="text-sm text-zinc-500">
              No sub categories assigned yet for this main category.
            </p>
          ) : (
            <ul className="space-y-2 text-sm text-zinc-700">
              {category.subcategories.map((subcategory: Pick<SubCategory, "id" | "name">) => (
                <li
                  key={subcategory.id}
                  className="rounded-lg border border-zinc-200 px-3 py-2"
                >
                  <div className="font-medium">{subcategory.name}</div>
                  <div className="mt-1 break-all text-xs text-zinc-500">
                    ID: {subcategory.id}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
