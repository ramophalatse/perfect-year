const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create a test user
  const passwordHash = await hash('password123', 10);
  
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: passwordHash,
      role: 'USER',
    },
  });
  
  console.log('Created test user:', testUser.id);

  // Create preset categories for the test user
  const presetCategories = [
    { name: 'Health & Fitness', description: 'Physical wellbeing goals' },
    { name: 'Career & Work', description: 'Professional development and work' },
    { name: 'Relationships', description: 'Family, friends, and social connections' },
    { name: 'Finances', description: 'Money management and financial goals' },
    { name: 'Personal Growth', description: 'Learning and self-development' },
  ];

  for (const category of presetCategories) {
    await prisma.category.upsert({
      where: {
        userId_name: {
          userId: testUser.id,
          name: category.name,
        },
      },
      update: {},
      create: {
        name: category.name,
        description: category.description,
        isPreset: true,
        userId: testUser.id,
      },
    });
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 