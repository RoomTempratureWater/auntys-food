const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.mealSchedule.findMany();
  console.log(bookings);
}

main().catch(console.error).finally(() => prisma.$disconnect());
