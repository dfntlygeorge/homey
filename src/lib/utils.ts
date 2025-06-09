import { ListingFilterSchema } from "@/app/_schemas/listing.schema";
import { AwaitedPageProps } from "@/config/types";
import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Province, CityMunicipality, Barangay } from "@/config/types";
import debounce from "debounce"; // Debouncing limits how often a function runs, especially for events that happen quickly, like typing in a search box. It waits until the user stops typing for a set time before executing the function.

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

// Helper function to find province ID by province code
export const findProvinceIdByCode = (
  provinces: Province[],
  provinceCode: string
): number | null => {
  const province = provinces.find((p) => p.code === provinceCode);
  return province ? province.id : null;
};

// Helper function to find city ID by city code
export const findCityIdByCode = (
  cities: CityMunicipality[],
  cityCode: string
): number | null => {
  const city = cities.find((c) => c.code === cityCode);
  return city ? city.id : null;
};

// Helper function to filter cities by province
export const filterCitiesByProvince = (
  cities: CityMunicipality[],
  provinceId: number
): CityMunicipality[] => {
  return cities.filter((city) => city.province_id === provinceId);
};

// Helper function to filter barangays by city
export const filterBarangaysByCity = (
  barangays: Barangay[],
  cityId: number
): Barangay[] => {
  return barangays.filter(
    (barangay) => barangay.city_municipality_id === cityId
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounceFunc<T extends (...args: any) => any>(
  func: T, // The function to debounce, can be any function that takes any arguments
  wait: number, // How long to wait before calling the function
  opts: { immediate: boolean } // Whether to run immediately or after delay
) {
  return debounce(func, wait, opts); // Returns the debounced function
}
