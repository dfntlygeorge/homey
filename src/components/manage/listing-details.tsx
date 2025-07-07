"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import { ListingWithImages } from "@/config/types";
import { cn, getStatusColor } from "@/lib/utils";

interface ListingDetailsProps {
  listing: ListingWithImages;
  isArchived?: boolean;
}

export function ListingDetails({
  listing,
  isArchived = false,
}: ListingDetailsProps) {
  return (
    <div className="flex gap-3 mb-3">
      {/* Image Section */}
      <div
        className={cn(
          "relative w-20 h-20 bg-zinc-200 flex-shrink-0 rounded-md overflow-hidden",
          isArchived && "opacity-60"
        )}
      >
        {listing.images[0] ? (
          <Image
            src={listing.images[0].url}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <Eye className="w-6 h-6 opacity-50" />
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3
            className={cn(
              "text-base font-semibold text-zinc-900 truncate",
              isArchived && "text-muted-foreground"
            )}
          >
            {listing.title}
          </h3>
          {/* Status Badge */}
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              getStatusColor(listing.status),
              "ml-2 flex-shrink-0",
              isArchived && "opacity-60"
            )}
          >
            {listing.status}
          </span>
        </div>

        <p
          className={cn(
            "text-lg font-bold text-zinc-900 mb-1",
            isArchived && "text-muted-foreground"
          )}
        >
          ₱{listing.rent.toLocaleString()}
        </p>

        <p className="text-xs text-zinc-500">2 views (14 days)</p>
      </div>
    </div>
  );
}
