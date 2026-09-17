import { NextResponse } from "next/server";
import {
  deleteHeroSlide,
  getHeroSlideById,
  updateHeroSlide,
} from "@/services/hero.service";
import { heroSlideUpdateSchema } from "@/validations/hero.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const serializeSlide = (
  slide: NonNullable<Awaited<ReturnType<typeof updateHeroSlide>>>
) => ({
  id: slide.id,
  imageUrl: slide.imageUrl,
  eyebrow: slide.eyebrow,
  title: slide.title,
  copy: slide.copy,
  position: slide.position,
  createdAt: slide.createdAt.toISOString(),
  updatedAt: slide.updatedAt.toISOString(),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const slide = await getHeroSlideById(id);

    if (!slide) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(serializeSlide(slide));
  } catch (error) {
    console.error("GET /api/hero-slides/[id] error", error);
    return NextResponse.json(
      { error: "Failed to load hero slide." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await getHeroSlideById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = heroSlideUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slide = await updateHeroSlide(id, parsed.data);
    return NextResponse.json(serializeSlide(slide));
  } catch (error) {
    console.error("PUT /api/hero-slides/[id] error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update hero slide.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const existing = await getHeroSlideById(id);

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await deleteHeroSlide(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/hero-slides/[id] error", error);
    return NextResponse.json(
      { error: "Failed to delete hero slide." },
      { status: 500 }
    );
  }
}
