import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

declare global {
  var prisma: PrismaClient | undefined;
  var mariadbPool: any | undefined;
}

const databaseUrl = process.env.DATABASE_URL || "mariadb://root:password@localhost:3306/dummy";
const connectionString = databaseUrl.replace(/^mysql:\/\//, "mariadb://");

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaMariaDb(connectionString);
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    // IMPORTANT: In dev, passing connectionString implicitly creates a pool in adapter-mariadb.
    // By keeping the adapter and PrismaClient on the global object, we NEVER re-instantiate them,
    // thereby never leaking the internal pool created by the adapter on HMR.
    const adapter = new PrismaMariaDb(connectionString);
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;
