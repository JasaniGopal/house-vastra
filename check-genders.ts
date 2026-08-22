import prisma from './lib/prisma';
async function main() {
  const products = await prisma.product.findMany({ select: { name: true, gender: true } });
  console.log(JSON.stringify(products, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
