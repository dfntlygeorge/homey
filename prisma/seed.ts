import prisma from "@/lib/prisma";
import {
  CaretakerAvailability,
  CurfewPolicy,
  GenderPolicy,
  KitchenAvailability,
  LaundryAvailability,
  ListingStatus,
  PetPolicy,
  RoomType,
  UserRole,
  UtilityInclusion,
  WifiAvailability,
} from "@prisma/client";
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
    contact: faker.phone.number(),

    genderPolicy: faker.helpers.arrayElement(
      Object.values(GenderPolicy)
    ) as GenderPolicy,
    status: faker.helpers.arrayElement(
      Object.values(ListingStatus)
    ) as ListingStatus,
    curfew: faker.helpers.arrayElement(
      Object.values(CurfewPolicy)
    ) as CurfewPolicy,
    laundry: faker.helpers.arrayElement(
      Object.values(LaundryAvailability)
    ) as LaundryAvailability,
    caretaker: faker.helpers.arrayElement(
      Object.values(CaretakerAvailability)
    ) as CaretakerAvailability,
    kitchen: faker.helpers.arrayElement(
      Object.values(KitchenAvailability)
    ) as KitchenAvailability,
    wifi: faker.helpers.arrayElement(
      Object.values(WifiAvailability)
    ) as WifiAvailability,
    utilities: faker.helpers.arrayElement(
      Object.values(UtilityInclusion)
    ) as UtilityInclusion,
    pets: faker.helpers.arrayElement(Object.values(PetPolicy)) as PetPolicy,

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
  const images = listings.flatMap((listing) =>
    Array.from({ length: 5 }, (_, i) => ({
      listingId: listing.id,
      url: `${imageUrl}?${i}`,
    }))
  );

  await prisma.image.createMany({ data: images });
}

async function main() {
  const listings = await prisma.listing.findMany();
  await seedImages(listings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
