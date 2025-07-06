import { Prisma, User } from "@prisma/client";
import { Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config/routes"; // Adjust import path as needed

interface ListingChatHeaderProps {
  listing: Prisma.ListingGetPayload<{
    include: {
      images: true;
      address: true;
      user: true;
    };
  }>;
  currentUserId: string;
  otherUser: User;
}

// Helper function to format room type
const formatRoomType = (roomType: string): string => {
  return roomType
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const ListingChatHeader = ({
  listing,
  currentUserId,
  otherUser,
}: ListingChatHeaderProps) => {
  const isOwner = listing.userId === currentUserId;
  const firstImage = listing.images?.[0]?.url;

  return (
    <div className="bg-white border-b border-zinc-200 p-4 flex-shrink-0">
      {/* Chat Partner Info */}
      <div className="flex items-center mb-3">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-zinc-900">
            {otherUser.name || "Unknown User"}
          </h2>
        </div>
      </div>

      {/* Listing Info */}
      <div className="flex gap-3 items-center">
        {/* Listing Image */}
        {firstImage && (
          <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-zinc-100">
            <Image
              src={firstImage}
              alt={listing.title}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Listing Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-zinc-900 truncate">
            {listing.title}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-base font-semibold text-zinc-900">
              ₱{listing.rent.toLocaleString()}
            </span>
            <span className="text-xs text-zinc-500">/ month</span>
            <span className="text-xs px-2 py-1 bg-zinc-100 rounded text-zinc-700">
              {formatRoomType(listing.roomType)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-500" />
              <span className="text-xs text-zinc-600">
                {listing.slotsAvailable} available
              </span>
            </div>
            <div
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                listing.isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {listing.isAvailable ? "Available" : "Unavailable"}
            </div>
          </div>
        </div>

        {/* View Listing Button */}
        {!isOwner && (
          <Link
            href={routes.listing(listing.id)}
            className="px-3 py-1.5 bg-zinc-900 text-white text-xs font-medium rounded-md hover:bg-zinc-800 transition-colors flex-shrink-0"
          >
            View Listing
          </Link>
        )}
      </div>
    </div>
  );
};
