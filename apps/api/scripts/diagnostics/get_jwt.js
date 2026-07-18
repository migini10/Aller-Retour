const { Client } = require('pg');
const jwt = require('jsonwebtoken');

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("SELECT id FROM users WHERE phone = '+221788696800'");
  await client.end();
  
  if (res.rows.length === 0) {
    console.error("User not found");
    return;
  }
  
  const userId = res.rows[0].id;
  const secret = process.env.JWT_SECRET || 'super-secret-key-panafrican-aller-retour-2026';
  
  const token = jwt.sign(
    { sub: userId, phone: '+221788696800', role: 'DRIVER', isVerified: true },
    secret,
    { expiresIn: '1d' }
  );
  
  console.log("=== JWT TOKEN ===");
  console.log(token);
  console.log("=================");
}

main().catch(console.error);
