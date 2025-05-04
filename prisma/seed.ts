import prisma from "@/lib/prisma";
import { RoomType, UserRole } from "@prisma/client";

async function main() {
  const users = {
    landlord: {
      email: "landlord@example.com",
      hashedPassword: "hashed_password", // Use bcrypt or another method to hash passwords
      role: UserRole.LANDLORD,
    },
    student: {
      email: "student@example.com",
      hashedPassword: "hashed_password", // Use bcrypt or another method to hash passwords
      role: UserRole.STUDENT,
    },
  };
  const landlord = await prisma.user.create({ data: users.landlord });
  const student = await prisma.user.create({ data: users.student });

  const listingData = {
    title: "Spacious Room for Rent",
    description: "A nice, spacious room in the heart of Baguio.",
    location: "Baguio City",
    rent: 3000,
    roomType: RoomType.STUDIO,
    slotsAvailable: 4,
    userId: landlord.id,
  };

  const listing = await prisma.listing.create({
    data: listingData,
  });

  const imagesData = [
    { url: "https://example.com/image1.jpg", listingId: listing.id },
    { url: "https://example.com/image2.jpg", listingId: listing.id },
  ];

  await prisma.image.createMany({
    data: imagesData,
  });

  const reviewData = {
    rating: 5,
    comment: "Great place!",
    userId: student.id,
    listingId: listing.id,
  };

  await prisma.review.create({
    data: reviewData,
  });

  console.log("🌱 Seeded successfully");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
