import { PageSchema } from "@/app/_schemas/page";
import { LISTINGS_PER_PAGE } from "@/config/constants";
import { AwaitedPageProps } from "@/config/types";
import prisma from "./prisma";
import { ListingFilterSchema } from "@/app/_schemas/listing.schema";
import { Prisma } from "@prisma/client";
import { filterListingsByDistance } from "./proximity-filter";

function buildClassifiedFilterQuery(
  searchParams: AwaitedPageProps["searchParams"] | undefined
): Prisma.ListingWhereInput {
  console.log("searchParams", searchParams);
  // Returns a Prisma.ClassifiedWhereInput object → This is a Prisma-compatible query object that can be used in prisma.classified.findMany().
  const { data } = ListingFilterSchema.safeParse(searchParams); // make sure the searchParams match the schema.
  if (!data) return {};

  const keys = Object.keys(data); // get the keys of the data object.

  const rangeFilters = {
    minRent: "rent",
    maxRent: "rent",
  };
  const enumFilters = [
    "roomType",
    "genderPolicy",
    "curfew",
    "laundry",
    "caretaker",
    "kitchen",
    "wifi",
    "pets",
    "utilities",
  ];

  // Extract geo parameters

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined; // get the value of the key from the searchParams.
      if (!value) return acc; // if the value is not present, return the accumulator.
      // Skip geo parameters as they're handled separately
      if (["latitude", "longitude", "radius", "address"].includes(key)) {
        return acc;
      }
      if (enumFilters.includes(key)) {
        acc[key] = value;
      } else if (key in rangeFilters) {
        const field = rangeFilters[key as keyof typeof rangeFilters]; //  Finds the actual field name in the database.
        acc[field] = acc[field] || {};

        if (key.startsWith("min")) {
          acc[field].gte = Number(value);
        } else if (key.startsWith("max")) {
          acc[field].lte = Number(value);
        }
      }

      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as { [key: string]: any }
  );

  return {
    // conditionally add an object property only when q exists.
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),

    ...mapParamsToFields,
  };
}

// Usage example in your API route or page component:
export async function getFilteredListings(
  searchParams: AwaitedPageProps["searchParams"] | undefined
) {
  // Get the base query (without geo filtering)
  const baseQuery = buildClassifiedFilterQuery(searchParams);

  // Extract geo parameters
  const latitude = searchParams?.latitude
    ? parseFloat(searchParams.latitude as string)
    : null;
  const longitude = searchParams?.longitude
    ? parseFloat(searchParams.longitude as string)
    : null;
  const radius = searchParams?.radius
    ? parseFloat(searchParams.radius as string)
    : null;
  const validPage = PageSchema.parse(searchParams?.page); // parse the page query parameter and ensures it matches the pageSchema.

  const page = validPage ? validPage : 1; // if the page query parameter is not present, set it to 1.
  const offset = (page - 1) * LISTINGS_PER_PAGE;

  // Fetch listings from database with base filters
  const listings = await prisma.listing.findMany({
    where: baseQuery,
    // Include other options like orderBy, select, etc.
    include: {
      images: { take: 1 }, // just take 1 since we dont have a carousel so it's useless to return all of them
    },
    skip: offset, // start at the correct record (pagination)
    take: LISTINGS_PER_PAGE, // limit the records to the page size.
  });

  // If geo parameters are provided, filter by distance
  if (latitude !== null && longitude !== null && radius !== null) {
    return filterListingsByDistance(listings, latitude, longitude, radius);
  }

  return listings;
}
