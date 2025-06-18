import { ListingFilterSchema } from "@/app/_schemas/listing.schema";
import { AwaitedPageProps, PropertyWithImages } from "@/config/types";
import { Prisma } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Province, CityMunicipality, Barangay } from "@/config/types";
import debounce from "debounce"; // Debouncing limits how often a function runs, especially for events that happen quickly, like typing in a search box. It waits until the user stops typing for a set time before executing the function.
import prisma from "./prisma";
import { LISTINGS_PER_PAGE } from "@/config/constants";
import { PageSchema } from "@/app/_schemas/page";

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

export function generateSessionToken(): string {
  return "xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
};
// Utility function to calculate distance between two geographic points using Haversine formula
export const getDistanceBetweenPoints = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers

  // Convert latitude and longitude from degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return R * c;
};

// Helper function to convert degrees to radians
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Separate function to filter listings by distance after fetching from database
export const filterListingsByDistance = (
  listings: PropertyWithImages[],
  centerLat: number,
  centerLon: number,
  radiusKm: number
): PropertyWithImages[] => {
  return listings.filter((listing) => {
    const distance = getDistanceBetweenPoints(
      centerLat,
      centerLon,
      listing.latitude,
      listing.longitude
    );
    return distance <= radiusKm;
  });
};

// Usage example in your API route or page component:
export const getFilteredListings = async (
  searchParams: AwaitedPageProps["searchParams"] | undefined
) => {
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
};

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string> => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Mapbox access token is not configured");
  }

  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&types=address`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch address");
  }

  const data = await response.json();

  if (data.features && data.features.length > 0) {
    return data.features[0].place_name;
  } else {
    throw new Error("No address found for this location");
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Helper function to compare File objects
function filesAreEqual(file1: File, file2: File): boolean {
  return (
    file1.name === file2.name &&
    file1.size === file2.size &&
    file1.type === file2.type &&
    file1.lastModified === file2.lastModified
  );
}

// Helper function to compare arrays that might contain Files
function arraysAreEqual(arr1: unknown[], arr2: unknown[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    const item1 = arr1[i];
    const item2 = arr2[i];

    // Special handling for File objects
    if (item1 instanceof File && item2 instanceof File) {
      if (!filesAreEqual(item1, item2)) {
        return false;
      }
    }
    // For other types, use JSON comparison (works for objects, primitives)
    else if (JSON.stringify(item1) !== JSON.stringify(item2)) {
      return false;
    }
  }

  return true;
}

export function getChangedFields<T extends Record<string, unknown>>(
  original: T,
  updated: T
): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in updated) {
    const originalValue = original[key];
    const updatedValue = updated[key];

    if (Array.isArray(updatedValue) && Array.isArray(originalValue)) {
      // Use our improved array comparison that handles Files
      if (!arraysAreEqual(originalValue, updatedValue)) {
        changed[key] = updatedValue;
      }
    } else if (updatedValue !== originalValue) {
      changed[key] = updatedValue;
    }
  }

  return changed;
}

// Example usage with File arrays:
/*
const file1 = new File(['content'], 'image1.jpg', { type: 'image/jpeg' });
const file2 = new File(['content'], 'image2.jpg', { type: 'image/jpeg' });

const original = { 
  name: "John", 
  images: [file1] 
};

const updated = { 
  name: "John", 
  images: [file1, file2]  // Added a new file
};

// This will correctly detect that images array changed
const result = getChangedFields(original, updated);
// Result: { images: [file1, file2] }
*/
