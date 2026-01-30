/*
  Warnings:

  - You are about to drop the column `day_Of_Week` on the `TutorSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `TutorSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `TutorSchedule` table. All the data in the column will be lost.
  - You are about to drop the column `tutorId` on the `TutorSchedule` table. All the data in the column will be lost.
  - Added the required column `day_of_week` to the `TutorSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `TutorSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `TutorSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutor_id` to the `TutorSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TutorSchedule" DROP CONSTRAINT "TutorSchedule_tutorId_fkey";

-- AlterTable
ALTER TABLE "TutorSchedule" DROP COLUMN "day_Of_Week",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "tutorId",
ADD COLUMN     "day_of_week" "DaysOfWeek" NOT NULL,
ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL,
ADD COLUMN     "tutor_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TutorSchedule" ADD CONSTRAINT "TutorSchedule_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "TutorProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
