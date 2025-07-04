import prisma from "@/lib/prisma";

export async function seedConversation() {
  // Get renter (student)
  const renter = await prisma.user.findFirst({
    where: { role: "STUDENT" },
  });

  if (!renter) throw new Error("No user with role STUDENT found");

  // Get owner (landlord or admin)
  const owner = await prisma.user.findFirst({
    where: {
      OR: [{ role: "LANDLORD" }, { role: "ADMIN" }],
    },
    include: {
      listings: true,
    },
  });

  if (!owner) throw new Error("No user with role LANDLORD or ADMIN found");
  if (owner.listings.length === 0) throw new Error("Owner has no listings");

  // Use first listing from owner
  const listing = owner.listings[0];

  // Create conversation
  const conversation = await prisma.conversation.create({
    data: {
      listingId: listing.id,
      renterId: renter.id,
      ownerId: owner.id,
    },
  });

  console.log(`✅ Created conversation ${conversation.id}`);
}
