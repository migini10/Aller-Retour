import { Client } from 'pg';

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.zgacbzvixojzkahmkacg:166455Touba@aws-1-eu-west-2.pooler.supabase.com:5432/postgres"
  });
  await client.connect();
  const res = await client.query("SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'driver_profiles';");
  console.table(res.rows);
  await client.end();
}
run();
