const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://postgres.zgacbzvixojzkahmkacg:166455Touba@aws-1-eu-west-2.pooler.supabase.com:6543/postgres'
  });
  await client.connect();
  const res = await client.query(`SELECT "failedAttempts", "blockedUntil" FROM users WHERE "fullName" LIKE '%auth-02%';`);
  console.log('User attempts:', res.rows);
  await client.end();
}

main().catch(console.error);
