CREATE TYPE "DiscountScope" AS ENUM ('CATEGORY', 'SUBCATEGORY', 'PRODUCT');
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'AMOUNT');

CREATE TABLE "Discount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" "DiscountScope" NOT NULL,
    "targetId" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Discount_active_startsAt_endsAt_idx" ON "Discount"("active", "startsAt", "endsAt");
CREATE INDEX "Discount_scope_targetId_idx" ON "Discount"("scope", "targetId");
