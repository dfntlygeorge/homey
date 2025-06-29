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
  {
    id: 5,
    href: routes.manage,
    label: "Manage",
  },
];

export const LISTINGS_PER_PAGE = 3;

export const EXCLUDED_KEYS = [
  "page",
  "latitude",
  "longitude",
  "address",
  "sortBy",
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const MIN_FILE_SIZE = 1024; // 1KB minimum to avoid empty files
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const EDIT_LISTING_STEPS = [
  {
    title: "Basic Info",
    description: "Title, description, and room details",
  },
  {
    title: "Pricing & Location",
    description: "Rent, availability, and address",
  },
  {
    title: "House Rules",
    description: "Policies and amenities",
  },
  {
    title: "Images",
    description: "Upload property photos",
  },
];

export const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Approved", value: "APPROVED" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
];

export const DATE_RANGE_OPTIONS = [
  { label: "All Time", value: "" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "3months" },
];

// export const SORT_OPTIONS = [
//   { label: "Newest First", value: "newest" },
//   { label: "Oldest First", value: "oldest" },
//   { label: "Price: High to Low", value: "price-high" },
//   { label: "Price: Low to High", value: "price-low" },
//   { label: "Status", value: "status" },
// ];

export const REPORT_REASONS = [
  { id: "spam", label: "Spam or misleading" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "fraud", label: "Fraud or scam" },
  { id: "duplicate", label: "Duplicate listing" },
  { id: "wrong-category", label: "Wrong category" },
  { id: "offensive", label: "Offensive language" },
  { id: "copyright", label: "Copyright violation" },
  { id: "other", label: "Other" },
];
export const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popular" },
  { label: "Recently Updated", value: "updated" },
] as const;
