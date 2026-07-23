-- AlterTable
ALTER TABLE "trips" ADD COLUMN "createdByDriverId" TEXT;
ALTER TABLE "trips" ADD COLUMN "paymentRecipientId" TEXT;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_createdByDriverId_fkey" FOREIGN KEY ("createdByDriverId") REFERENCES "driver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_paymentRecipientId_fkey" FOREIGN KEY ("paymentRecipientId") REFERENCES "driver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
