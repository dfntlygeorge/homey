import { ListingWithImagesAndAddress } from "@/config/types";
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
import { ListingMinimap } from "../shared/map";
import { Suspense } from "react";
import { MapSkeleton } from "./skeleton/map-skeleton";
import { ListingDetailsSkeleton } from "./skeleton/listing-details-skeleton";
import { MoreListingActions } from "./more-listing-actions";

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

export const ListingView = async (props: ListingWithImagesAndAddress) => {
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
    contact,
  } = props;

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Left Column - Images and Map */}
          <div className="lg:w-3/5">
            <div className="mb-6">
              <ListingCarousel images={images} />
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Suspense fallback={<MapSkeleton />}>
                <ListingMinimap
                  address={address.formattedAddress}
                  longitude={address.longitude}
                  latitude={address.latitude}
                  showExpandButton={true}
                />
              </Suspense>
            </div>
          </div>

          {/* Right Column - Property Details */}
          <div className="mt-8 lg:mt-0 lg:w-2/5">
            <Suspense fallback={<ListingDetailsSkeleton />}>
              <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                {/* Property Header */}
                <div className="border-b border-gray-100 pb-6 mb-6">
                  <div className="flex justify-between items-start mb-3">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {title}
                    </h1>
                    <MoreListingActions listingId={id} />
                  </div>

                  <p className="text-gray-600 text-base mb-4 flex items-center">
                    📍 {address.formattedAddress}
                  </p>

                  {/* Price and Room Type */}
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-green-600">₱{rent}</p>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-lg text-gray-700 mt-2 font-medium">
                    {formatEnumValue(roomType)}
                  </p>
                </div>

                {/* Description */}
                {description && (
                  <div className="border-b border-gray-100 pb-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      About This Place
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-b border-gray-100 pb-6 mb-6 space-y-4">
                  <Link href={routes.reserve(id)}>
                    <Button
                      className="w-full py-4 text-lg font-bold uppercase tracking-wide hover:shadow-lg transition-all duration-200"
                      title={!session ? "You need to sign in to reserve" : ""}
                      size="lg"
                    >
                      Reserve Now
                    </Button>
                  </Link>

                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Not sure yet?</p>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            href={facebookProfile ?? ""}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                          >
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
                              Contact number: {contact}{" "}
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
                    Property Features
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {features(props).map(({ id, icon, label }) => (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex-shrink-0">{icon}</div>
                        <p className="text-sm font-medium text-gray-700 leading-tight">
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
    </div>
  );
};
