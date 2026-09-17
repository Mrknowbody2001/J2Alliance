ALTER TABLE "HeroSection" ADD COLUMN "key" TEXT;

DELETE FROM "HeroSection"
WHERE "id" IN (
    SELECT "id"
    FROM (
        SELECT
            "id",
            ROW_NUMBER() OVER (ORDER BY "createdAt" ASC, "id" ASC) AS "rowNumber"
        FROM "HeroSection"
    ) ranked_sections
    WHERE ranked_sections."rowNumber" > 1
);

UPDATE "HeroSection" SET "key" = 'home' WHERE "key" IS NULL;

ALTER TABLE "HeroSection" ALTER COLUMN "key" SET NOT NULL;
ALTER TABLE "HeroSection" ALTER COLUMN "key" SET DEFAULT 'home';

CREATE UNIQUE INDEX "HeroSection_key_key" ON "HeroSection"("key");
