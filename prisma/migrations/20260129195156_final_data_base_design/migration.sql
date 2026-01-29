/*
  Warnings:

  - You are about to drop the column `category_id` on the `TutorProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[booking_id]` on the table `Reviews` will be added. If there are existing duplicate values, this will fail.
  - The required column `trakking_code` was added to the `Bookings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "TutorProfile" DROP CONSTRAINT "TutorProfile_category_id_fkey";

-- DropIndex
DROP INDEX "TutorProfile_category_id_idx";

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "session_link" TEXT,
ADD COLUMN     "trakking_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "category_id";

-- CreateTable
CREATE TABLE "TutorCategory" (
    "tutor_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "TutorCategory_pkey" PRIMARY KEY ("tutor_id","category_id")
);

-- CreateIndex
CREATE INDEX "TutorCategory_category_id_idx" ON "TutorCategory"("category_id");

-- CreateIndex
CREATE INDEX "TutorCategory_tutor_id_idx" ON "TutorCategory"("tutor_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_booking_id_key" ON "Reviews"("booking_id");

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorCategory" ADD CONSTRAINT "TutorCategory_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "TutorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorCategory" ADD CONSTRAINT "TutorCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
