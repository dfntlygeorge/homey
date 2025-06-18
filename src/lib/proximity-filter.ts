import { ListingWithImages } from "@/config/types";

// Utility function to calculate distance between two geographic points using Haversine formula
export function getDistanceBetweenPoints(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
}

// Helper function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Separate function to filter listings by distance after fetching from database
export function filterListingsByDistance(
  listings: ListingWithImages[],
  centerLat: number,
  centerLon: number,
  radiusKm: number
): ListingWithImages[] {
  return listings.filter((listing) => {
    const distance = getDistanceBetweenPoints(
      centerLat,
      centerLon,
      listing.latitude,
      listing.longitude
    );
    return distance <= radiusKm;
  });
}
