-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "publicReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookings_publicReference_key" ON "bookings"("publicReference");

