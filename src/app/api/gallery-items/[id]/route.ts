import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextResponse } from "next/server";
import {
  deleteGalleryItem,
  getGalleryItemById,
  updateGalleryItem,
} from "@/services/gallery.service";
import { galleryItemUpdateSchema } from "@/validations/gallery.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const serializeItem = (
  item: NonNullable<Awaited<ReturnType<typeof updateGalleryItem>>>
) => ({
  id: item.id,
  imageUrl: item.imageUrl,
  categoryId: item.categoryId,
  categoryName: item.category.name,
  position: item.position,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = await getGalleryItemById(id);

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeItem(item));
  } catch (error) {
    console.error("GET /api/gallery-items/[id] error", error);
    return NextResponse.json(
      { error: "Failed to load gallery item." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getGalleryItemById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = galleryItemUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const item = await updateGalleryItem(id, parsed.data);
    return NextResponse.json(serializeItem(item));
  } catch (error) {
    console.error("PUT /api/gallery-items/[id] error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update gallery item.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await context.params;
    const existing = await getGalleryItemById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteGalleryItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/gallery-items/[id] error", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item." },
      { status: 500 }
    );
  }
}
