import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = (process.env.DATABASE_URL as string).replace(/^mysql:\/\//, "mariadb://");
const prisma = global.prisma || new PrismaClient({ adapter: new PrismaMariaDb(connectionString) });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
