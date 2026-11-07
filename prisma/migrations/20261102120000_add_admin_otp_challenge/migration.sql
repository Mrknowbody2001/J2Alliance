CREATE TABLE "AdminOtpChallenge" (
    "id" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "resendAfter" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminOtpChallenge_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AdminOtpChallenge_expiresAt_idx" ON "AdminOtpChallenge"("expiresAt");
