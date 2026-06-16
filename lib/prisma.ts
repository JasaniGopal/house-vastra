import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL || "mariadb://root:password@localhost:3306/dummy";
const connectionString = databaseUrl.replace(/^mysql:\/\//, "mariadb://");
const prisma = global.prisma || new PrismaClient({ adapter: new PrismaMariaDb(connectionString) });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
