import { prisma } from "@/lib/prisma";
import type { HeroSectionInput, HeroSlideInput } from "@/types";

const DEFAULT_MAX_SLIDES = 3;

const heroInclude = {
  slides: {
    orderBy: { position: "asc" as const },
  },
};

async function ensureHeroSection() {
  return prisma.heroSection.upsert({
    where: {
      key: "home",
    },
    create: {
      key: "home",
      maxSlides: DEFAULT_MAX_SLIDES,
    },
    update: {},
    include: heroInclude,
  });
}

export async function getHeroSection() {
  return ensureHeroSection();
}

export async function updateHeroSection(data: HeroSectionInput) {
  const section = await ensureHeroSection();

  if (data.maxSlides < section.slides.length) {
    throw new Error(
      `Hero already has ${section.slides.length} slide(s). Delete slides before lowering the limit.`
    );
  }

  return prisma.heroSection.update({
    where: { id: section.id },
    data: {
      maxSlides: data.maxSlides,
    },
    include: heroInclude,
  });
}

export async function createHeroSlide(data: HeroSlideInput) {
  const section = await ensureHeroSection();

  if (section.slides.length >= section.maxSlides) {
    throw new Error(
      `Hero slide limit reached. Increase the limit above ${section.maxSlides} to add more slides.`
    );
  }

  const nextPosition =
    data.position ??
    (section.slides.length > 0
      ? Math.max(...section.slides.map((slide) => slide.position)) + 1
      : 0);

  return prisma.heroSlide.create({
    data: {
      imageUrl: data.imageUrl,
      eyebrow: data.eyebrow || null,
      title: data.title,
      copy: data.copy || null,
      position: nextPosition,
      heroSectionId: section.id,
    },
  });
}

export async function getHeroSlideById(id: string) {
  if (!id) {
    throw new Error("Hero slide id is required.");
  }

  return prisma.heroSlide.findUnique({
    where: { id },
    include: {
      heroSection: true,
    },
  });
}

export async function updateHeroSlide(
  id: string,
  data: Partial<HeroSlideInput>
) {
  if (!id) {
    throw new Error("Hero slide id is required.");
  }

  return prisma.heroSlide.update({
    where: { id },
    data: {
      ...data,
      eyebrow: data.eyebrow === undefined ? undefined : data.eyebrow || null,
      copy: data.copy === undefined ? undefined : data.copy || null,
    },
  });
}

export async function deleteHeroSlide(id: string) {
  if (!id) {
    throw new Error("Hero slide id is required.");
  }

  const existing = await prisma.heroSlide.findUnique({
    where: { id },
    select: {
      id: true,
      heroSectionId: true,
    },
  });

  if (!existing) {
    throw new Error("Hero slide not found.");
  }

  const [, remainingSlides] = await prisma.$transaction([
    prisma.heroSlide.delete({
      where: { id },
    }),
    prisma.heroSlide.findMany({
      where: {
        heroSectionId: existing.heroSectionId,
      },
      orderBy: { position: "asc" },
      select: {
        id: true,
      },
    }),
  ]);

  await Promise.all(
    remainingSlides.map((slide, index) =>
      prisma.heroSlide.update({
        where: { id: slide.id },
        data: {
          position: index,
        },
      })
    )
  );

  return { ok: true };
}
