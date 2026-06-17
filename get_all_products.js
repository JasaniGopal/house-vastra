const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log("Found products:", products.length);
  products.forEach(p => {
    console.log(`- ${p.name}: approved=${p.approvalStatus}, isAvailable=${p.isAvailable}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
