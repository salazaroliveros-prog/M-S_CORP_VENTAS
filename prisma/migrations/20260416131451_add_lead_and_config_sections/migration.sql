-- AlterTable
ALTER TABLE "Config" ADD COLUMN     "sections" JSONB;

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "m2" INTEGER NOT NULL,
    "estimatedTotal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
