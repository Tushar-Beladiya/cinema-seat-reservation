-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('Available', 'Booked');

-- CreateTable
CREATE TABLE "cinemas" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "rows" INTEGER NOT NULL,
    "seatsPerRow" INTEGER NOT NULL,

    CONSTRAINT "cinemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "row" INTEGER NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'Available',
    "cinemaId" TEXT NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cinemas_name_idx" ON "cinemas"("name");

-- CreateIndex
CREATE INDEX "seats_cinemaId_row_seatNumber_idx" ON "seats"("cinemaId", "row", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "seats_cinemaId_row_seatNumber_key" ON "seats"("cinemaId", "row", "seatNumber");

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "cinemas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
