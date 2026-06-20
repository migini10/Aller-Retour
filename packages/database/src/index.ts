import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

import * as dotenv from 'dotenv';
import * as path from 'path';

// Try to load from apps/api/.env if it exists, otherwise fallback to local .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

let connectionString = process.env.DATABASE_URL;

// Auto-fix for production (Render/Vercel) to bypass Supabase PgBouncer issues with Prisma
if (connectionString) {
  connectionString = connectionString
    .replace(':6543', ':5432')
    .replace('?pgbouncer=true', '')
    .replace('&pgbouncer=true', '');
}

console.log("DB INIT - process.env.DATABASE_URL is:", process.env.DATABASE_URL);
const pool = new Pool({ 
  connectionString,
  max: 5, // Limit connections to avoid EMAXCONNSESSION on Supabase free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
