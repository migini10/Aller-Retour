-- CreateEnum
CREATE TYPE "DriverOperationalStatus" AS ENUM ('DISPONIBLE', 'INDISPONIBLE', 'EN_RAMASSAGE', 'EN_ROUTE', 'EN_PAUSE');

-- AlterTable
ALTER TABLE "driver_profiles" ADD COLUMN "operationalStatus" "DriverOperationalStatus" NOT NULL DEFAULT 'INDISPONIBLE';
ALTER TABLE "driver_profiles" ADD COLUMN "pinHash" TEXT;
