import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient
}
//! Exports a singleton Prisma client instance for database access.
export const prisma = globalForPrisma.prisma || new PrismaClient()

if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

