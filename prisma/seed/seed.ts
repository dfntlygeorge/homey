import prisma from "@/lib/prisma";

async function main() {
  console.log("UPDATING FIRST RESERVATION acceptedAt...");

  // Find first reservation
  const revieww = await prisma.review.findMany({
    orderBy: { createdAt: "asc" }, // adjust ordering if needed
  });
  console.log(revieww);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
