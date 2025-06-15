import { routes } from "./routes";
import { ListingFormStep } from "./types";

export const navLinks = [
  {
    id: 1,
    href: routes.home,
    label: "Home",
  },
  {
    id: 2,
    href: routes.listings,
    label: "Listings",
  },
  {
    id: 3,
    href: routes.admin,
    label: "Admin",
  },
  {
    id: 4,
    href: routes.createListing(ListingFormStep.WELCOME),
    label: "Create Listing",
  },
];

export const LISTINGS_PER_PAGE = 9;

export const EXCLUDED_KEYS = ["page", "latitude", "longitude", "address"];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const MIN_FILE_SIZE = 1024; // 1KB minimum to avoid empty files
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;
