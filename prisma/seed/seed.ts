import prisma from "@/lib/prisma";

async function main() {
  console.log("DELETING NOTIFICATIONS...");

  await prisma.notification.deleteMany();

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
