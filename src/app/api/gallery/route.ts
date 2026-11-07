import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import {
  getGallerySection,
  updateGallerySection,
} from "@/services/gallery.service";
import { gallerySectionUpdateSchema } from "@/validations/gallery.schema";

const serializeGallery = (gallery: Awaited<ReturnType<typeof getGallerySection>>) => ({
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
});

export async function GET() {
  try {
    const gallery = await getGallerySection();
    return NextResponse.json(serializeGallery(gallery));
  } catch (error) {
    console.error("GET /api/gallery error", error);
    return NextResponse.json(
      { error: "Failed to load gallery settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = gallerySectionUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const gallery = await updateGallerySection(parsed.data);
    return NextResponse.json(serializeGallery(gallery));
  } catch (error) {
    console.error("PUT /api/gallery error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update gallery settings.",
      },
      { status: 500 }
    );
  }
}
