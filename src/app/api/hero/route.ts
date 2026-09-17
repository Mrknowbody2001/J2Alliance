import { NextResponse } from "next/server";
import {
  getHeroSection,
  updateHeroSection,
} from "@/services/hero.service";
import { heroSectionUpdateSchema } from "@/validations/hero.schema";

const serializeHero = (hero: Awaited<ReturnType<typeof getHeroSection>>) => ({
  id: hero.id,
  maxSlides: hero.maxSlides,
  createdAt: hero.createdAt.toISOString(),
  updatedAt: hero.updatedAt.toISOString(),
  slides: hero.slides.map((slide) => ({
    id: slide.id,
    imageUrl: slide.imageUrl,
    eyebrow: slide.eyebrow,
    title: slide.title,
    copy: slide.copy,
    position: slide.position,
    createdAt: slide.createdAt.toISOString(),
    updatedAt: slide.updatedAt.toISOString(),
  })),
});

export async function GET() {
  try {
    const hero = await getHeroSection();
    return NextResponse.json(serializeHero(hero));
  } catch (error) {
    console.error("GET /api/hero error", error);
    return NextResponse.json(
      { error: "Failed to load hero settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = heroSectionUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const hero = await updateHeroSection(parsed.data);
    return NextResponse.json(serializeHero(hero));
  } catch (error) {
    console.error("PUT /api/hero error", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update hero settings.",
      },
      { status: 500 }
    );
  }
}
