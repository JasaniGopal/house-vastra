import prisma from '../lib/prisma';

async function main() {
  const categories = [
    { name: 'Lehengas', slug: 'lehengas' },
    { name: 'Sarees', slug: 'sarees' },
    { name: 'Sherwanis', slug: 'sherwanis' },
    { name: 'Suits', slug: 'suits' },
    { name: 'Gowns', slug: 'gowns' },
    { name: 'Kurta Sets', slug: 'kurta-sets' },
  ];

  console.log(`Start seeding categories...`);
  for (const category of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log(`Created category with id: ${cat.id} (${cat.name})`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
