import prisma from "@/lib/prisma";
// import { seedMessages } from "./message.seed";

async function main() {
  console.log("UPDATING RESERVATION...");

  // Create a date that is 1 month and a few days ago
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setDate(date.getDate() - 5); // Optionally make it a bit more than 1 month

  await prisma.reservation.update({
    where: { id: 3 },
    data: {
      acceptedAt: date,
    },
  });

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
