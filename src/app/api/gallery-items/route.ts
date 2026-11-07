import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import {
  createGalleryItem,
  getGallerySection,
} from "@/services/gallery.service";
import { galleryItemCreateSchema } from "@/validations/gallery.schema";

const serializeItem = (
  item: NonNullable<Awaited<ReturnType<typeof createGalleryItem>>>
) => ({
  id: item.id,
  imageUrl: item.imageUrl,
  categoryId: item.categoryId,
  categoryName: item.category.name,
  position: item.position,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export async function GET() {
  try {
    const gallery = await getGallerySection();
    return NextResponse.json(gallery.items.map(serializeItem));
  } catch (error) {
    console.error("GET /api/gallery-items error", error);
    return NextResponse.json(
      { error: "Failed to load gallery items." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const parsed = galleryItemCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const item = await createGalleryItem(parsed.data);
    return NextResponse.json(serializeItem(item), { status: 201 });
  } catch (error) {
    console.error("POST /api/gallery-items error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create gallery item.",
      },
      { status: 500 }
    );
  }
}
