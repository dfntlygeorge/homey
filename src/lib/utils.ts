import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import debounce from "debounce"; // Debouncing limits how often a function runs, especially for events that happen quickly, like typing in a search box. It waits until the user stops typing for a set time before executing the function.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(rent: number): string {
  return rent.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatEnumValue(enumValue: string): string {
  return enumValue
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

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

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
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
}
