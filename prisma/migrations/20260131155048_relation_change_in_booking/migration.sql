-- DropForeignKey
ALTER TABLE "Bookings" DROP CONSTRAINT "Bookings_tutor_id_fkey";

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "TutorProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
