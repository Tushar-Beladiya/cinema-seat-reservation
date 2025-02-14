-- DropForeignKey
ALTER TABLE "seats" DROP CONSTRAINT "seats_cinemaId_fkey";

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "cinemas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
