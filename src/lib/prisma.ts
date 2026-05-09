import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaMariaDb | undefined;
};

if (!globalForPrisma.adapter) {
  globalForPrisma.adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: Number(process.env.DATABASE_PORT) || 3306,
    connectionLimit: 5,
    ssl: { rejectUnauthorized: false },
  });
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    adapter: globalForPrisma.adapter,
  });
}

const prisma = globalForPrisma.prisma;
export default prisma;
