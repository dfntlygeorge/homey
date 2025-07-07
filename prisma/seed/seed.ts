import prisma from "@/lib/prisma";

async function main() {
  console.log("UPDATING REVIEWS...");

  await prisma.review.deleteMany();

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
