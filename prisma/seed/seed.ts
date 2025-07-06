import prisma from "@/lib/prisma";
// import { seedMessages } from "./message.seed";

async function main() {
  console.log("DELETING CONERSATIONS");
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
