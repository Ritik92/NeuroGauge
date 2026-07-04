// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// Reuse a single PrismaClient across hot-reloads / serverless invocations to
// avoid exhausting the database connection pool.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
