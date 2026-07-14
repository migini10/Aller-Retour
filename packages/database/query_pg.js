const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.zgacbzvixojzkahmkacg:166455Touba@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?sslmode=require', ssl: { rejectUnauthorized: false } });
client.connect().then(() => {
  client.query('SELECT phone FROM users LIMIT 10;', (err, res) => {
    if (err) throw err;
    console.log(res.rows);
    client.end();
  });
});
