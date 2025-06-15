import { PropertyWithImages } from "@/config/types";
import {
  UtensilsIcon,
  WifiIcon,
  BoltIcon,
  PawPrintIcon,
  UsersIcon,
  ClockIcon,
  WashingMachineIcon,
  UserCheckIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Listing } from "@prisma/client";
import { routes } from "@/config/routes";
import { auth } from "@/auth";
import { cn, formatEnumValue } from "@/lib/utils";
import { ListingCarousel } from "./listing-carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ListingMinimap } from "../shared/minimap";
import { Suspense } from "react";
import { MinimapSkeleton } from "./minimap-skeleton";
import { ListingDetailsSkeleton } from "./listing-details-skeleton";

const features = (listing: Listing) => [
  {
    id: 1,
    icon: (
      <UsersIcon
        className={cn(
          "h-6 w-6",
          listing.genderPolicy === "MIXED"
            ? "text-blue-500"
            : listing.genderPolicy === "MALE_ONLY"
            ? "text-cyan-600"
            : "text-pink-500"
        )}
      />
    ),
    label:
      listing.genderPolicy === "MIXED"
        ? "Mixed Gender"
        : listing.genderPolicy === "MALE_ONLY"
        ? "Male Only"
        : "Female Only",
  },
  {
    id: 2,
    icon: (
      <WashingMachineIcon
        className={cn(
          "h-6 w-6",
          listing.laundry === "AVAILABLE" ? "text-green-600" : "text-gray-400"
        )}
      />
    ),
    label:
      listing.laundry === "AVAILABLE"
        ? "Laundry Area Available"
        : "No Laundry Area",
  },
  {
    id: 3,
    icon: (
      <UserCheckIcon
        className={cn(
          "h-6 w-6",
          listing.caretaker === "AVAILABLE"
            ? "text-purple-600"
            : "text-gray-400"
        )}
      />
    ),
    label:
      listing.caretaker === "AVAILABLE" ? "With Caretaker" : "No Caretaker",
  },
  {
    id: 4,
    icon: (
      <UtensilsIcon
        className={cn(
          "h-6 w-6",
          listing.kitchen === "AVAILABLE" ? "text-yellow-600" : "text-gray-400"
        )}
      />
    ),
    label:
      listing.kitchen === "AVAILABLE" ? "Kitchen Access" : "No Kitchen Access",
  },
  {
    id: 5,
    icon: (
      <WifiIcon
        className={cn(
          "h-6 w-6",
          listing.wifi === "AVAILABLE" ? "text-indigo-600" : "text-gray-400"
        )}
      />
    ),
    label: listing.wifi === "AVAILABLE" ? "Wi-Fi Available" : "No Wi-Fi",
  },
  {
    id: 6,
    icon: (
      <BoltIcon
        className={cn(
          "h-6 w-6",
          listing.utilities === "INCLUDED" ? "text-emerald-600" : "text-red-400"
        )}
      />
    ),
    label:
      listing.utilities === "INCLUDED"
        ? "Utilities Included"
        : "Utilities Not Included",
  },
  {
    id: 7,
    icon: (
      <ClockIcon
        className={cn(
          "h-6 w-6",
          listing.curfew === "HAS_CURFEW" ? "text-orange-600" : "text-gray-400"
        )}
      />
    ),
    label: listing.curfew === "HAS_CURFEW" ? "Has Curfew" : "No Curfew",
  },
  {
    id: 8,
    icon: (
      <PawPrintIcon
        className={cn(
          "h-6 w-6",
          listing.pets === "ALLOWED" ? "text-pink-500" : "text-gray-400"
        )}
      />
    ),
    label: listing.pets === "ALLOWED" ? "Pets Allowed" : "No Pets Allowed",
  },
];

export const PropertyView = async (props: PropertyWithImages) => {
  const session = await auth();
  const {
    images,
    title,
    description,
    address,
    rent,
    roomType,
    id,
    facebookProfile,
    contactInfo,
    longitude,
    latitude,
  } = props;
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* CHANGE: Added background color and min-height for better visual separation */}
      <div className="container mx-auto px-4 py-6 lg:px-8">
        {/* CHANGE: Improved container padding for better mobile experience */}

        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* CHANGE: Changed breakpoint from md to lg for better responsive behavior */}

          {/* Left Column - Images and Map */}
          <div className="lg:w-3/5">
            {/* CHANGE: Adjusted width ratio from 1/2 to 3/5 for better image prominence */}

            {/* Image Carousel */}
            <div className="mb-6">
              {/* CHANGE: Added wrapper div with margin for better spacing */}
              <ListingCarousel images={images} />
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* CHANGE: Added background, rounded corners, and shadow for card-like appearance */}
              <Suspense fallback={<MinimapSkeleton />}>
                <ListingMinimap
                  address={address}
                  longitude={longitude}
                  latitude={latitude}
                  showExpandButton={true}
                />
              </Suspense>
            </div>
          </div>

          {/* Right Column - Property Details */}
          <div className="mt-8 lg:mt-0 lg:w-2/5">
            {/* CHANGE: Adjusted width ratio and improved mobile spacing */}
            <Suspense fallback={<ListingDetailsSkeleton />}>
              <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                {/* CHANGE: Added card container with padding for better visual grouping */}

                {/* Property Header */}
                <div className="border-b border-gray-100 pb-6 mb-6">
                  {/* CHANGE: Added border and spacing for visual separation */}
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {/* CHANGE: Improved text color and spacing */}
                    {title}
                  </h1>
                  <p className="text-gray-600 text-base mb-4 flex items-center">
                    {/* CHANGE: Improved text styling and spacing */}
                    📍 {address}
                  </p>

                  {/* Price and Room Type */}
                  <div className="flex items-baseline gap-3">
                    {/* CHANGE: Better alignment and spacing for price section */}
                    <p className="text-3xl font-bold text-green-600">₱{rent}</p>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-lg text-gray-700 mt-2 font-medium">
                    {/* CHANGE: Improved styling for room type */}
                    {formatEnumValue(roomType)}
                  </p>
                </div>

                {/* Description */}
                {description && (
                  <div className="border-b border-gray-100 pb-6 mb-6">
                    {/* CHANGE: Added border and consistent spacing pattern */}
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      {/* CHANGE: Improved heading styling */}
                      About This Place
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {/* CHANGE: Improved line height for better readability */}
                      {description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-b border-gray-100 pb-6 mb-6 space-y-4">
                  {/* CHANGE: Added border and improved spacing consistency */}
                  <Link href={routes.reserve(id)}>
                    <Button
                      className="w-full py-4 text-lg font-bold uppercase tracking-wide hover:shadow-lg transition-all duration-200"
                      title={!session ? "You need to sign in to reserve" : ""}
                      size="lg"
                    >
                      {/* CHANGE: Enhanced button styling with better padding, hover effects, and transitions */}
                      Reserve Now
                    </Button>
                  </Link>

                  <div className="text-center">
                    {/* CHANGE: Better container for contact section */}
                    <p className="text-sm text-gray-600 mb-2">
                      {/* CHANGE: Improved text styling */}
                      Not sure yet?
                    </p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={facebookProfile ?? ""}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          >
                            {/* CHANGE: Enhanced contact link styling with background, padding, and hover effects */}
                            💬 Contact Owner
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          {facebookProfile ? (
                            <p>
                              You&apos;ll be redirected to the owner&apos;s
                              Facebook profile
                            </p>
                          ) : (
                            <p>
                              Contact number: {contactInfo}{" "}
                              {facebookProfile ?? "tite"}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Features Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {/* CHANGE: Improved heading styling to match other sections */}
                    Property Features
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {/* CHANGE: Simplified grid layout for better mobile experience */}
                    {features(props).map(({ id, icon, label }) => (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {/* CHANGE: Changed from column to row layout, added hover effects and better spacing */}
                        <div className="flex-shrink-0">{icon}</div>
                        <p className="text-sm font-medium text-gray-700 leading-tight">
                          {/* CHANGE: Improved text styling and line height */}
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        {/* CHANGE: Added border-top and improved shadow for better visual separation */}
        <Link
          href={routes.listings}
          className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
          {/* CHANGE: Enhanced back link with better styling, spacing, and hover effects */}
          ← Back to Listings
        </Link>
      </div>
    </div>
  );
};
