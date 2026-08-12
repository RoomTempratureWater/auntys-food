const path = require('path');
const fs = require('fs');

const envPath = fs.existsSync(path.resolve(process.cwd(), '.env')) 
  ? path.resolve(process.cwd(), '.env') 
  : path.resolve(process.cwd(), '../.env');

require('dotenv').config({ path: envPath });
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const globalForPrisma = global;

let prisma = globalForPrisma.prisma;

if (!prisma) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

module.exports = { prisma };
