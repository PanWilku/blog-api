// src/db.ts
// Prisma Client is generated to src/generated/prisma (see prisma/schema.prisma)
import { PrismaClient } from '../generated/prisma/index.js';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['warn', 'error'], // add 'query' while debugging if you want
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;