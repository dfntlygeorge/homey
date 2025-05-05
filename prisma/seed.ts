import prisma from "@/lib/prisma";
import { RoomType, UserRole } from "@prisma/client";
import { faker } from "@faker-js/faker";

const imageUrl =
  "https://luxurylux.s3.ap-southeast-2.amazonaws.com/uploads/Online-House-Rental-Sites.jpg";

async function seedLandlord() {
  return await prisma.user.create({
    data: {
      email: "landlord@example.com",
      hashedPassword: "hashed_password", // Use real hashing in prod
      role: UserRole.LANDLORD,
    },
  });
}

async function seedListings(landlordId: string) {
  const listings = Array.from({ length: 15 }, (_, i) => ({
    title: `Listing ${i + 1}`,
    description: faker.lorem.paragraph(),
    location: faker.location.city(),
    rent:
      faker.number.int({ min: 1000, max: 10000 }) -
      (faker.number.int({ min: 1000, max: 10000 }) % 1000),
    roomType: faker.helpers.arrayElement(Object.values(RoomType)),
    slotsAvailable: faker.number.int({ min: 1, max: 10 }),
    contactInfo: faker.phone.number(),
    userId: landlordId,
  }));

  await prisma.listing.createMany({ data: listings });

  // Fetch the listings with IDs after creation
  return await prisma.listing.findMany({
    where: { userId: landlordId },
    select: { id: true },
  });
}

async function seedImages(listings: { id: number }[]) {
  const images = listings.map((listing) => ({
    listingId: listing.id,
    url: imageUrl,
  }));

  await prisma.image.createMany({ data: images });
}

async function main() {
  const landlord = await seedLandlord();
  const listings = await seedListings(landlord.id);
  await seedImages(listings);

  console.log("✅ Seeded landlord, listings, and images.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
