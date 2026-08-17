const { prisma } = require('./index.js');

async function main() {
  const bookings = await prisma.mealSchedule.findMany();
  console.log(JSON.stringify(bookings, null, 2));
}

main().catch(console.error).finally(() => {
  if (prisma) prisma.$disconnect();
});
