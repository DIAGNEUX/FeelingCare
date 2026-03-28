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

  for (const emotion of emotions) {
    await prisma.emotion.upsert({
      where: { name: emotion.name },
      update: {},
      create: { name: emotion.name },
    });
  }

  console.log('✅ Emotions seedées avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });