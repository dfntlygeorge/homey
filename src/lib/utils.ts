import { ListingFilterSchema } from "@/app/_schemas/listing.schema";
import { AwaitedPageProps } from "@/config/types";
import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (rent: number): string => {
  return rent.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export function formatEnumValue(enumValue: string): string {
  return enumValue
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined
): Prisma.ListingWhereInput => {
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

  const mapParamsToFields = keys.reduce(
    (acc, key) => {
      const value = searchParams?.[key] as string | undefined; // get the value of the key from the searchParams.
      if (!value) return acc; // if the value is not present, return the accumulator.
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
};
