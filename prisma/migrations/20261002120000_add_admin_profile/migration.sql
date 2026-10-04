CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL DEFAULT 'admin',
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "imageUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminProfile_username_key" ON "AdminProfile"("username");
