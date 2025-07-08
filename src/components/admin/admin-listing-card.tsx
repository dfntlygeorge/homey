"use client";

import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  ListingWithAddress,
  ListingWithImagesUserAndReports,
} from "@/config/types";
import { AdminListingDetails } from "./admin-listing-details";
import { AdminListingActionButtons } from "./admin-listing-action-buttons";
import { AdminListingUserInfo } from "./admin-user-info";
import { AdminListingPreviewButton } from "./admin-listing-preview-button";
import { AdminListingMoreActions } from "./admin-listing-more-actions";

interface AdminListingCardProps {
  listing: ListingWithImagesUserAndReports & ListingWithAddress;
}

export function AdminListingCard({ listing }: AdminListingCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white">
      <CardContent className="p-6">
        {/* Top Section: Image and Details */}
        <div className="flex gap-4 mb-6">
          {/* Image Section */}
          <div className="relative w-24 h-24 bg-zinc-100 flex-shrink-0 rounded-xl overflow-hidden border">
            {listing.images[0] ? (
              <Image
                src={listing.images[0].url}
                alt={listing.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400">
                <Eye className="w-8 h-8" />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 min-w-0">
            <AdminListingDetails listing={listing} />
            <AdminListingUserInfo listing={listing} />
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex gap-3">
          <AdminListingActionButtons listing={listing} />

          <div className="flex gap-2 sm:ml-auto w-full sm:w-auto justify-end">
            <AdminListingPreviewButton listing={listing} />
            <AdminListingMoreActions listing={listing} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
