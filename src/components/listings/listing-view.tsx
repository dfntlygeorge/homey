"use client";

import {
  UtensilsIcon,
  WifiIcon,
  BoltIcon,
  PawPrintIcon,
  UsersIcon,
  ClockIcon,
  WashingMachineIcon,
  UserCheckIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Listing, Prisma } from "@prisma/client";
import { calculateAverageRating, cn, formatEnumValue } from "@/lib/utils";
import { ListingCarousel } from "./listing-carousel";
import { ListingMinimap } from "../shared/map";
import { Suspense, useState } from "react";
import { MapSkeleton } from "./skeleton/map-skeleton";
import { ListingDetailsSkeleton } from "./skeleton/listing-details-skeleton";
import { MoreListingActions } from "./more-listing-actions";
import { ReviewsModal } from "../reviews/reviews-modal";
import { ChatOwnerButton } from "./chat-owner-button";
import { routes } from "@/config/routes";

interface ListingViewProps {
  listing: Prisma.ListingGetPayload<{
    include: {
      images: true;
      address: {
        include: {
          reviews: {
            include: {
              user: true;
            };
          };
        };
      };
      user: true;
    };
  }>;
}

const features = (listing: Listing) => [
  {
    id: 1,
    icon: (
      <UsersIcon
        className={cn(
          "h-5 w-5",
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
          "h-5 w-5",
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
          "h-5 w-5",
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
          "h-5 w-5",
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
          "h-5 w-5",
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
          "h-5 w-5",
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
          "h-5 w-5",
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
          "h-5 w-5",
          listing.pets === "ALLOWED" ? "text-pink-500" : "text-gray-400"
        )}
      />
    ),
    label: listing.pets === "ALLOWED" ? "Pets Allowed" : "No Pets Allowed",
  },
];

// Helper function to render stars
const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <StarIcon key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <StarIcon className="h-4 w-4 text-gray-300" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    } else {
      stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
    }
  }

  return stars;
};

// Description component with show more/less functionality
const DescriptionSection = ({ description }: { description: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const CHAR_LIMIT = 200;

  if (!description) return null;

  const shouldTruncate = description.length > CHAR_LIMIT;
  const displayText =
    shouldTruncate && !isExpanded
      ? description.substring(0, CHAR_LIMIT) + "..."
      : description;

  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        About This Place
      </h2>
      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUpIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              Show more <ChevronDownIcon className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export const ListingView = ({ listing }: ListingViewProps) => {
  const { images, title, description, address, rent, roomType, id, user } =
    listing;
  const ownerId = user.id;

  const reviews = address.reviews || [];
  const averageRating = calculateAverageRating(reviews);
  const reviewCount = reviews.length;

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
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Property Header */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {title}
                    </h1>
                    <MoreListingActions listingId={id} />
                  </div>

                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    📍 {address.formattedAddress}
                  </p>

                  {/* Price and Room Type */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-2xl font-bold text-green-600">₱{rent}</p>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                  <p className="text-base text-gray-700 font-medium">
                    {formatEnumValue(roomType)}
                  </p>
                </div>

                {/* Ratings and Reviews Section */}
                {reviewCount > 0 && (
                  <div className="border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {renderStars(averageRating)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({reviewCount}{" "}
                        {reviewCount === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                    <ReviewsModal
                      reviews={reviews}
                      averageRating={averageRating}
                    />
                  </div>
                )}

                {/* Description */}
                <DescriptionSection description={description} />

                {/* Owner Actions */}
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Contact Owner
                  </h3>
                  <div className="flex gap-3">
                    <Link href={routes.profilePage(ownerId)} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2 text-sm"
                      >
                        <UserIcon className="h-4 w-4" />
                        View Profile
                      </Button>
                    </Link>
                    <div className="flex-1">
                      <ChatOwnerButton listingId={id} ownerId={ownerId} />
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Property Features
                  </h2>
                  <div className="space-y-2">
                    {features(listing).map(({ id, icon, label }) => (
                      <div
                        key={id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
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
