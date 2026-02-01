-- DropForeignKey
ALTER TABLE "Reviews" DROP CONSTRAINT "Reviews_tutor_id_fkey";

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "TutorProfile"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
