import { Prisma } from "@prisma/client";
import { Users, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config/routes";
import { Button } from "../ui/button";
import { formatRoomType } from "@/lib/utils";

interface ListingPreviewProps {
  listing: Prisma.ListingGetPayload<{
    include: {
      images: true;
      address: true;
      user: true;
    };
  }>;
  isOwner: boolean;
  actionButtons: React.ReactNode;
}

export const ListingPreview = ({
  listing,
  isOwner,
  actionButtons,
}: ListingPreviewProps) => {
  const firstImage = listing.images?.[0]?.url;

  return (
    <div className="flex gap-3 items-start">
      {/* Listing Image */}
      {firstImage && (
        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-100">
          <Image
            src={firstImage}
            alt={listing.title}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Listing Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-zinc-900 truncate mb-1">
          {listing.title}
        </h3>

        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
          <span className="text-base sm:text-lg font-bold text-zinc-900">
            ₱{listing.rent.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm text-zinc-500">/ month</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm flex-wrap">
          <span className="px-2 py-1 bg-zinc-100 rounded-md text-zinc-700 font-medium text-xs">
            {formatRoomType(listing.roomType)}
          </span>

          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-500 flex-shrink-0" />
            <span className="text-zinc-600 whitespace-nowrap">
              {listing.slotsAvailable} available
            </span>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              listing.isAvailable
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {listing.isAvailable ? (
              <CheckCircle className="w-3 h-3 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
            )}
            <span className="whitespace-nowrap">
              {listing.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 items-end flex-shrink-0">
        {!isOwner && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 min-w-0 px-2 sm:px-3"
          >
            <Link href={routes.listing(listing.id)}>
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">View</span>
            </Link>
          </Button>
        )}

        {actionButtons}
      </div>
    </div>
  );
};
