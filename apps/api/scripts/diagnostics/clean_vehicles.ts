import { prisma } from '@aller-retour/database';

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  console.log(`Starting cleanup... Dry run: ${isDryRun}`);

  const incompleteVehicles = await prisma.vehicle.findMany({
    where: {
      approvalStatus: 'PENDING_REVIEW',
      OR: [
        { frontPhotoKey: null },
        { rearPhotoKey: null },
        { sidePhotoKey: null }
      ]
    },
    include: {
      owner: {
        include: { user: true }
      }
    }
  });

  if (incompleteVehicles.length === 0) {
    console.log("No incomplete PENDING_REVIEW vehicles found.");
    return;
  }

  console.log(`Found ${incompleteVehicles.length} incomplete PENDING_REVIEW vehicles:`);
  for (const v of incompleteVehicles) {
    console.log(`- ID: ${v.id} | Plate: ${v.plateNumber} | Driver: ${v.owner?.user?.phone}`);
    console.log(`  Keys: front=${v.frontPhotoKey}, rear=${v.rearPhotoKey}, side=${v.sidePhotoKey}`);
  }

  if (!isDryRun) {
    const ids = incompleteVehicles.map(v => v.id);
    const result = await prisma.vehicle.deleteMany({
      where: { id: { in: ids } }
    });
    console.log(`Successfully deleted ${result.count} vehicles.`);
  } else {
    console.log("\nDry run complete. Run without --dry-run to execute deletion.");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
