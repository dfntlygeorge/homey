import prisma from "@/lib/prisma";
import { RoomType, UserRole } from "@prisma/client";
import { faker } from "@faker-js/faker";

const imageUrl =
  "https://luxurylux.s3.ap-southeast-2.amazonaws.com/uploads/Online-House-Rental-Sites.jpg";

async function seedListings(landlordId: string) {
  const listings = Array.from({ length: 15 }, (_, i) => ({
    title: faker.company.name(),
    description: faker.lorem.paragraph(),
    location: faker.location.city(),
    rent:
      faker.number.int({ min: 1000, max: 10000 }) -
      (faker.number.int({ min: 1000, max: 10000 }) % 1000),
    roomType: faker.helpers.arrayElement(Object.values(RoomType)),
    slotsAvailable: faker.number.int({ min: 1, max: 10 }),
    contactInfo: faker.phone.number(),

    genderPolicy: faker.helpers.arrayElement([
      "MALE_ONLY",
      "FEMALE_ONLY",
      "MIXED",
    ]),
    hasLaundry: faker.datatype.boolean(),
    hasCaretaker: faker.datatype.boolean(),
    hasKitchen: faker.datatype.boolean(),
    hasWifi: faker.datatype.boolean(),
    includesUtilities: faker.datatype.boolean(),
    hasCurfew: faker.datatype.boolean(),
    petsAllowed: faker.datatype.boolean(),

    userId: landlordId,
  }));

  await prisma.listing.createMany({ data: listings });
  return await prisma.listing.findMany({
    where: { userId: landlordId },
    select: { id: true },
  });
}

async function seedLandlord() {
  const landlord = await prisma.user.findFirst();
  if (!landlord) throw new Error("No users found in the database");

  const updatedLandlord = await prisma.user.update({
    where: { id: landlord.id },
    data: { role: UserRole.LANDLORD },
  });

  return updatedLandlord;
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
