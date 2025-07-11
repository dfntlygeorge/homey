import prisma from "@/lib/prisma";

async function main() {
  console.log("DELETING NOTIFICATIONS...");

  await prisma.review.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.report.deleteMany();
  await prisma.message.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.image.deleteMany();
  await prisma.conversation.deleteMany();

  console.log("SUCCESSFUL");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
