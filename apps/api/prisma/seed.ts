import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const emotions = [
    { name: 'Triste' },
    { name: 'Stressé' },
    { name: 'Confus' },
    { name: 'Fatigué' },
    { name: 'En colère' },
  ];

  // Seed emotions
  for (const emotion of emotions) {
    await prisma.emotion.upsert({
      where: { name: emotion.name },
      update: {},
      create: { name: emotion.name },
    });
  }

  // 🔥 Seed user (ICI)
  await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      id: "dev-user-1",
      email: "test@test.com",
    },
  });

  console.log('✅ Emotions + User seedés avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });