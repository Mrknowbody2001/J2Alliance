import { requireAdmin } from "@/lib/admin-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import RichTextContent from "@/components/ui/rich-text-content";
import { getProductById } from "@/services/product.service";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 2,
});

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  await requireAdmin();
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">Product Details</p>
          <h1 className="text-3xl font-semibold text-zinc-900">
            {product.title}
          </h1>
        </div>
        <Link
          href={`/admin/products/edit/${product.id}`}
          className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
        >
          Edit Product
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Description</h2>
            <RichTextContent
              content={product.description}
              className="mt-2 text-zinc-600"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Price</h2>
            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {currency.format(product.price)}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Organization</h2>
            <div className="mt-2 space-y-1 text-sm text-zinc-600">
              <p>Main Category: {product.category.name}</p>
              <p>Sub Category: {product.subCategory.name}</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">SEO Tags</h2>
            <p className="mt-2 text-sm text-zinc-600">
              {product.seoTags || "—"}
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-dashed border-zinc-200 bg-white p-6 text-sm text-zinc-500">
          {product.images.length > 0 ? (
            <div className="space-y-3">
              <p className="font-medium text-zinc-700">Product Images</p>
              <div className="grid grid-cols-2 gap-3">
                {product.images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200"
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {image === product.thumbnail && (
                      <span className="absolute left-2 top-2 rounded bg-black px-2 py-0.5 text-xs text-white">
                        Thumbnail
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            "No product images yet. Add one to improve the storefront experience."
          )}
        </div>
      </div>
    </div>
  );
}
