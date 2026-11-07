import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import ProductTable from "@/components/admin-components/product-table";
import { listProducts } from "@/services/product.service";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await requireAdmin();
  const products = await listProducts();

  const serializedProducts = products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    subCategoryId: product.subCategoryId,
    subCategoryName: product.subCategory.name,
    seoTitle: product.seoTitle,
    seoDesc: product.seoDesc,
    seoTags: product.seoTags,
    images: product.images,
    thumbnail: product.thumbnail,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Products</h1>
          <p className="text-sm text-zinc-500">
            Manage your catalog, pricing, and product organization.
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Create Product
        </Link>
      </div>
      <ProductTable products={serializedProducts} />
    </div>
  );
}
