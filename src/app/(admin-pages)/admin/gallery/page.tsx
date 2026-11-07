import { requireAdmin } from "@/lib/admin-auth";
import GalleryManager from "@/components/admin-components/gallery-manager";
import { listCategoriesBasic } from "@/services/category.service";
import { getGallerySection } from "@/services/gallery.service";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await requireAdmin();
  const [gallery, categories] = await Promise.all([
    getGallerySection(),
    listCategoriesBasic(),
  ]);

  const serializedGallery = {
    id: gallery.id,
    maxItems: gallery.maxItems,
    createdAt: gallery.createdAt.toISOString(),
    updatedAt: gallery.updatedAt.toISOString(),
    items: gallery.items.map((item) => ({
      id: item.id,
      imageUrl: item.imageUrl,
      categoryId: item.categoryId,
      categoryName: item.category.name,
      position: item.position,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    })),
  };

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Homepage Gallery</h1>
        <p className="text-sm text-zinc-500">
          Manage gallery images, decide how many images the section can show, and
          connect each image to the main category page users should visit.
        </p>
      </div>

      <GalleryManager
        categories={categoryOptions}
        initialGallery={serializedGallery}
      />
    </div>
  );
}
