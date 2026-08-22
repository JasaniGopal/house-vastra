import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL || "mariadb://root:password@localhost:3306/dummy";
const connectionString = databaseUrl.replace(/^mysql:\/\//, "mariadb://");
const poolConnectionString = connectionString.includes('?') 
  ? `${connectionString}&connectionLimit=1&allowPublicKeyRetrieval=true` 
  : `${connectionString}?connectionLimit=1&allowPublicKeyRetrieval=true`;

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaMariaDb(poolConnectionString);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    const adapter = new PrismaMariaDb(poolConnectionString);
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;
