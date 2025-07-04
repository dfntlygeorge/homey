import prisma from "@/lib/prisma";
import { seedMessages } from "./message.seed";

async function main() {
  await seedMessages();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
