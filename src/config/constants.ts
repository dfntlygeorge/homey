import { routes } from "./routes";
import { ListingWithAddress } from "./types";

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
    href: routes.faq,
    label: "Faq",
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

export const MODERATION_PROMPT = (listing: ListingWithAddress) => {
  const {
    title,
    description,
    address,
    contact,
    facebookProfile,
    rent,
    roomType,
    slotsAvailable,
  } = listing;
  const formattedAddress = address.formattedAddress;
  return `
  You are a strict content moderation system for rental listings in the Philippines.

Definitions:
- "approve": Listing is clearly safe, no suspicious or policy-violating content.
- "manual_review": Listing may contain suspicious or potentially misleading content (e.g., unusually low price, unclear payment process), but it is not obviously a scam or explicit violation. Needs human check.
- "reject": Listing clearly violates policy (e.g., explicit scams, threats, hateful or explicit content, explicit instructions to pay before viewing).

If you are unsure or if the listing looks suspicious but does not clearly break policy, choose "manual_review" rather than "reject".

Examples:

Example 1
Title: Clean room for rent
Description: Spacious room for ₱5,000 per month. You can view anytime, no advance payment.
Action: approve

Example 2
Title: Super cheap room ₱1,500
Description: Fully furnished, no photos, payment before viewing. Contact only via Facebook.
Action: manual_review

Example 3
Title: Pay before viewing guaranteed slot!
Description: Pay full via GCash before you can visit. No refunds. Limited slots.
Action: reject

Instructions:
Analyze the following listing and decide:
- An action: "approve", "manual_review", or "reject".
- A short reason explaining your decision (max 20 words). Only include the reason if action is "manual_review" or "reject". Do not include a reason for "approve".

Return ONLY a JSON object in the following exact format:

{
  "action": "approve" | "manual_review" | "reject",
  "reason": string (optional, only if action is "manual_review" or "reject")
}

Listing Title: ${title}
Description: ${description}
Address: ${formattedAddress}
Contact Info: ${contact}
Facebook Profile: ${facebookProfile}
Rent: ${rent}
Room Type: ${roomType}
Slots Available: ${slotsAvailable}
  `;
};

export const HARDCODED_PROMPT = `
You are a strict content moderation system for rental listings in the Philippines.

Definitions:
- "approve": Listing is clearly safe, no suspicious or policy-violating content.
- "manual_review": Listing may contain suspicious or potentially misleading content (e.g., unusually low price, unclear payment process), but it is not obviously a scam or explicit violation. Needs human check.
- "reject": Listing clearly violates policy (e.g., explicit scams, threats, hateful or explicit content, explicit instructions to pay before viewing).

If you are unsure or if the listing looks suspicious but does not clearly break policy, choose "manual_review" rather than "reject".

Examples:

Example 1
Title: Clean room for rent
Description: Spacious room for ₱5,000 per month. You can view anytime, no advance payment.
Action: approve

Example 2
Title: Super cheap room ₱1,500
Description: Fully furnished, no photos, payment before viewing. Contact only via Facebook.
Action: manual_review

Example 3
Title: Pay before viewing guaranteed slot!
Description: Pay full via GCash before you can visit. No refunds. Limited slots.
Action: reject

Instructions:
Analyze the following listing and decide:
- An action: "approve", "manual_review", or "reject".
- A short reason explaining your decision (max 20 words). Only include the reason if action is "manual_review" or "reject". Do not include a reason for "approve".

Return ONLY a JSON object in the following exact format:

{
  "action": "approve" | "manual_review" | "reject",
  "reason": string (optional, only if action is "manual_review" or "reject")
}

Listing Title: Spacious Room with Balcony Near SLU
Description: Large, airy room with private balcony, ideal for students or young professionals. Rent includes water and high-speed Wi-Fi. Shared kitchen and laundry facilities available. Secure and quiet neighborhood, just a 5-minute walk to Saint Louis University. You can visit anytime before deciding — no upfront payment required. One-month advance and one-month deposit required upon move-in, standard policy. Available now! Feel free to message to schedule a viewing.
Address: Magsaysay Avenue, Baguio City
Contact Info: 09181234567
Facebook Profile: https://facebook.com/spaciousroombaguio
Rent: 6500
Room Type: ROOM
Slots Available: 1
`;
