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
