import HeroManager from "@/components/admin-components/hero-manager";
import { getHeroSection } from "@/services/hero.service";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const hero = await getHeroSection();

  const serializedHero = {
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
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900">Homepage Hero</h1>
        <p className="text-sm text-zinc-500">
          Manage the homepage hero image scroller, choose the slide limit, and
          edit or delete previous slides.
        </p>
      </div>

      <HeroManager initialHero={serializedHero} />
    </div>
  );
}
