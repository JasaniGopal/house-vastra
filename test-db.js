const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log("All products:", products.map(p => ({
    id: p.id,
    name: p.name,
    approvalStatus: p.approvalStatus,
    isAvailable: p.isAvailable
  })));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
