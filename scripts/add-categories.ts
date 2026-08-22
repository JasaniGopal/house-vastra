import 'dotenv/config';
import prisma from '../lib/prisma';

const categories = [
  "Anarkalis & Suits",
  "Bridal Lehanga",
  "College Farewells",
  "Indo western",
  "Jodhpuri",
  "Maternity",
  "Pre-wedding",
  "Sherwani",
  "Indo jackets",
  "Groom",
  "Formals",
  "Blazers"
];

const occasions = [
  "Cocktail",
  "College Fest",
  "Engagement",
  "Formal Meeting",
  "Haldi",
  "Reception",
  "Sangeet",
  "Wedding",
  "college farewell",
  "Indian festivals",
  "pre wedding",
  "maternity shoot"
];

function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  console.log("Adding new categories...");
  for (const name of categories) {
    const slug = generateSlug(name);
    await prisma.category.upsert({
      where: { name: name },
      update: {},
      create: {
        name,
        slug
      }
    });
    console.log(`- Category: ${name}`);
  }

  console.log("\nAdding new occasions...");
  for (const name of occasions) {
    const slug = generateSlug(name);
    await prisma.occasion.upsert({
      where: { name: name },
      update: {},
      create: {
        name,
        slug
      }
    });
    console.log(`- Occasion: ${name}`);
  }

  console.log("\nDone!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
