const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users in DB:", users.length);
  
  if (users.length === 0) {
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@houseofvastra.com',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    console.log("Created admin user:", admin.email);
  } else {
    console.log("Users:", users.map(u => ({ email: u.email, role: u.role })));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
