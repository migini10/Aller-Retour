const { Client } = require('pg');
async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log("Tables:", res.rows.map(r => r.table_name));
  
  // Also query the Vehicle table if it exists (case insensitive search)
  const vehicleTable = res.rows.find(r => r.table_name.toLowerCase() === 'vehicles' || r.table_name.toLowerCase() === 'vehicle')?.table_name;
  if (vehicleTable) {
    const v = await client.query(`SELECT * FROM "${vehicleTable}" WHERE "plate_number" = 'AA225AB' OR "plateNumber" = 'AA225AB'`);
    console.log("Vehicle AA225AB:", v.rows[0]);
  }
  await client.end();
}
main().catch(console.error);
