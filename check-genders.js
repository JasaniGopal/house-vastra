const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true, gender: true } });
  console.log(JSON.stringify(products, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
