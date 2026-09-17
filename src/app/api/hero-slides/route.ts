import { NextResponse } from "next/server";
import {
  createHeroSlide,
  getHeroSection,
} from "@/services/hero.service";
import { heroSlideCreateSchema } from "@/validations/hero.schema";

const serializeSlide = (
  slide: NonNullable<Awaited<ReturnType<typeof createHeroSlide>>>
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

export async function GET() {
  try {
    const hero = await getHeroSection();
    return NextResponse.json(hero.slides.map(serializeSlide));
  } catch (error) {
    console.error("GET /api/hero-slides error", error);
    return NextResponse.json(
      { error: "Failed to load hero slides." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = heroSlideCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const slide = await createHeroSlide(parsed.data);
    return NextResponse.json(serializeSlide(slide), { status: 201 });
  } catch (error) {
    console.error("POST /api/hero-slides error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create hero slide.",
      },
      { status: 500 }
    );
  }
}
