import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import debounce from "debounce"; // Debouncing limits how often a function runs, especially for events that happen quickly, like typing in a search box. It waits until the user stops typing for a set time before executing the function.
import { ListingStatus, Review } from "@prisma/client";
import { GenerateContentResponse } from "@google/genai";
import { ModerationResponse } from "@/config/types";
import { format, isToday, isYesterday, isThisWeek, isThisYear } from "date-fns";

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

export const getStatusLabel = (status: ListingStatus | "" | undefined) => {
  switch (status) {
    case "PENDING":
      return "Pending Listings";
    case "APPROVED":
      return "Approved Listings";
    case "REJECTED":
      return "Rejected Listings";
    default:
      return "All Listings";
  }
};

export function formatTimestamp(createdAt?: Date) {
  if (!createdAt) return "";
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export async function parseAiRawResponse(response: GenerateContentResponse) {
  if (!response.text) {
    // non ai moderator fallback TODO
    return;
  }
  const cleaned = response.text
    .replace(/```json\s*/g, "") // remove ```json
    .replace(/```/g, "") // remove closing ```
    .trim();

  const parsed: ModerationResponse = JSON.parse(cleaned);

  return parsed;
}

export function calculateAverageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
}

export const formatTimeAgo = (date: Date | string): string => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - messageDate.getTime()) / 1000
  );

  // Less than a minute
  if (diffInSeconds < 60) {
    return "Sent now";
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Sent ${minutes}m ago`;
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Sent ${hours}h ago`;
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Sent ${days}d ago`;
  }

  // Less than a month (30 days)
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `Sent ${weeks}w ago`;
  }

  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `Sent ${months}mo ago`;
  }

  // More than a year
  const years = Math.floor(diffInSeconds / 31536000);
  return `Sent ${years}y ago`;
};

// Format timestamp for hover display (shows date context when needed)
export const formatHoverTimestamp = (date: Date | string): string => {
  const messageDate = new Date(date);

  // Today: show just time
  if (isToday(messageDate)) {
    return format(messageDate, "h:mm a");
  }

  // Yesterday: show "Yesterday" + time
  if (isYesterday(messageDate)) {
    return `Yesterday ${format(messageDate, "h:mm a")}`;
  }

  // This week: show day name + time
  if (isThisWeek(messageDate)) {
    return format(messageDate, "EEEE h:mm a"); // e.g., "Monday 2:30 PM"
  }

  // This year: show month/day + time
  if (isThisYear(messageDate)) {
    return format(messageDate, "MMM d, h:mm a"); // e.g., "Jan 15, 2:30 PM"
  }

  // Different year: show full date + time
  return format(messageDate, "MMM d, yyyy h:mm a"); // e.g., "Jan 15, 2023 2:30 PM"
};

export const formatRoomType = (roomType: string): string => {
  return roomType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export function getStatusColor(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}
