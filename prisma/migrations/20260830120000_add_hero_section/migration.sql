CREATE TABLE "HeroSection" (
    "id" TEXT NOT NULL,
    "maxSlides" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HeroSlide" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "copy" TEXT,
    "heroSectionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSlide_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HeroSlide_heroSectionId_position_idx" ON "HeroSlide"("heroSectionId", "position");

ALTER TABLE "HeroSlide" ADD CONSTRAINT "HeroSlide_heroSectionId_fkey" FOREIGN KEY ("heroSectionId") REFERENCES "HeroSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
