import { PageSchema } from "@/app/_schemas/page.schema";
import { LISTINGS_PER_PAGE } from "@/config/constants";
import { AwaitedPageProps, ListingWithImagesAndAddress } from "@/config/types";
import prisma from "./prisma";
import { ListingFilterSchema } from "@/app/_schemas/listing.schema";
import { ListingStatus, Prisma } from "@prisma/client";
import { filterListingsByDistance } from "./proximity-filter";

// Define the return type for our combined function
export interface FilteredListingsResult {
  listings: ListingWithImagesAndAddress[]; // Replace with your actual listing type
  totalCount: number;
  totalPages: number;
}

function buildClassifiedFilterQuery(
  searchParams: AwaitedPageProps["searchParams"] | undefined
): Prisma.ListingWhereInput {
  console.log("searchParams", searchParams);
  const { data } = ListingFilterSchema.safeParse(searchParams);
  if (!data) return {};

  const keys = Object.keys(data);

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

  const mapParamsToFields = keys.reduce((acc, key) => {
    const value = searchParams?.[key] as string | undefined;
    if (!value) return acc;

    // Skip geo parameters as they're handled separately
    if (
      ["latitude", "longitude", "radius", "address", "sortBy"].includes(key)
    ) {
      return acc;
    }

    if (enumFilters.includes(key)) {
      acc[key] = value;
    } else if (key in rangeFilters) {
      const field = rangeFilters[key as keyof typeof rangeFilters];
      acc[field] = acc[field] || {};

      if (key.startsWith("min")) {
        acc[field].gte = Number(value);
      } else if (key.startsWith("max")) {
        acc[field].lte = Number(value);
      }
    }

    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }, {} as { [key: string]: any });

  return {
    isAvailable: true,
    isArchived: false,
    status: ListingStatus.APPROVED,
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

// Helper function to build sort order based on sortBy parameter
function buildSortOrder(
  sortBy?: string
): Prisma.ListingOrderByWithRelationInput[] {
  switch (sortBy) {
    case "newest":
      return [{ createdAt: "desc" }];
    case "oldest":
      return [{ createdAt: "asc" }];
    case "price_asc":
      return [{ rent: "asc" }];
    case "price_desc":
      return [{ rent: "desc" }];
    case "popular":
      // Assuming you have a views or bookmarks count field
      // You might need to add these fields to your schema
      return [{ viewCount: "desc" }, { createdAt: "desc" }];
    case "updated":
      return [{ updatedAt: "desc" }];
    default:
      // Default sorting: newest first
      return [{ createdAt: "desc" }];
  }
}

// OPTIMIZED: Combined function that handles both listings and count in one go
export async function getFilteredListingsWithCount(
  searchParams: AwaitedPageProps["searchParams"] | undefined
): Promise<FilteredListingsResult> {
  const baseQuery = buildClassifiedFilterQuery(searchParams);
  const sortOrder = buildSortOrder(searchParams?.sortBy as string);

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

  const validPage = PageSchema.parse(searchParams?.page);
  const page = validPage ? validPage : 1;
  const offset = (page - 1) * LISTINGS_PER_PAGE;

  // Case 1: No geo filtering - we can use efficient database operations
  if (latitude === null || longitude === null || radius === null) {
    // Run both queries in parallel for better performance
    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where: baseQuery,
        include: {
          images: { take: 1 },
          address: true,
        },
        orderBy: sortOrder,
        skip: offset,
        take: LISTINGS_PER_PAGE,
      }),
      prisma.listing.count({
        where: baseQuery,
      }),
    ]);

    return {
      listings,
      totalCount,
      totalPages: Math.ceil(totalCount / LISTINGS_PER_PAGE),
    };
  }

  // Case 2: Geo filtering required - we need to fetch and filter
  // NOTE: This is still a performance bottleneck, but it's unavoidable with Prisma
  // Consider using raw SQL or a dedicated geo database for production
  const allListings = await prisma.listing.findMany({
    where: baseQuery,
    include: {
      images: { take: 1 },
      address: true,
    },
    orderBy: sortOrder,
  });

  // Filter by distance
  const filteredListings = filterListingsByDistance(
    allListings,
    latitude,
    longitude,
    radius
  );

  // Apply pagination manually after geo filtering
  const totalCount = filteredListings.length;
  const paginatedListings = filteredListings.slice(
    offset,
    offset + LISTINGS_PER_PAGE
  );

  return {
    listings: paginatedListings,
    totalCount,
    totalPages: Math.ceil(totalCount / LISTINGS_PER_PAGE),
  };
}
