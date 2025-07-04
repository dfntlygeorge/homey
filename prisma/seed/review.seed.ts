import prisma from "@/lib/prisma";
import { faker } from "@faker-js/faker";

export async function seedReviews() {
  // Fetch all users and addresses
  const users = await prisma.user.findMany({ select: { id: true } });
  const addresses = await prisma.address.findMany({ select: { id: true } });

  if (users.length === 0) throw new Error("No users found in the database");
  if (addresses.length === 0)
    throw new Error("No addresses found in the database");

  const reviewsData = Array.from({ length: 13 }, () => ({
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.lorem.sentences({ min: 1, max: 3 }),

    userId: faker.helpers.arrayElement(users).id,
    addressId: faker.helpers.arrayElement(addresses).id,
  }));

  await prisma.review.createMany({
    data: reviewsData,
  });

  console.log(`✅ Seeded ${reviewsData.length} reviews`);
}
