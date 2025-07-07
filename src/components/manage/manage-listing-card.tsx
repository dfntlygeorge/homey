"use client";

import { Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ListingDetails } from "./listing-details";
import { ListingActions } from "./listing-actions";
import { Prisma } from "@prisma/client";

interface ManageListingCardProps {
  listing: Prisma.ListingGetPayload<{
    include: {
      images: true;
      reservations: {
        include: {
          user: true;
        };
      };
    };
  }>;
  isArchived?: boolean;
}

export function ManageListingCard({
  listing,
  isArchived = false,
}: ManageListingCardProps) {
  const handleArchiveToggle = () => {
    // This callback can be used to trigger any parent component updates
    // For example, refreshing the listing data or removing from current view
    console.log("Archive status toggled for listing:", listing.id);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        isArchived && "bg-muted/30 border-dashed"
      )}
    >
      <CardContent className="py-1 px-3">
        {/* Archive Banner */}
        {isArchived && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center gap-2 text-amber-800">
              <Archive className="h-4 w-4" />
              <span className="text-xs font-medium">Archived Listing</span>
            </div>
          </div>
        )}

        {/* Listing Details Component */}
        <ListingDetails listing={listing} isArchived={isArchived} />

        {/* Listing Actions Component */}
        <ListingActions
          listing={listing}
          isArchived={isArchived}
          onArchiveToggle={handleArchiveToggle}
        />
      </CardContent>
    </Card>
  );
}
