"use client";

import { User, Calendar, MapPin } from "lucide-react";
import {
  ListingWithImagesUserAndReports,
  ListingWithAddress,
} from "@/config/types";

interface AdminListingUserInfoProps {
  listing: ListingWithImagesUserAndReports & ListingWithAddress;
}

export function AdminListingUserInfo({ listing }: AdminListingUserInfoProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-2 text-sm text-zinc-600 hidden sm:block">
      <div className="flex items-center gap-2">
        <User className="w-3 h-3 text-zinc-400" />
        <span className="font-medium">{listing.user.name}</span>
        <span className="text-zinc-400">•</span>
        <span className="text-zinc-500 truncate">{listing.user.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3 text-zinc-400" />
        <span>Submitted {formatDate(listing.createdAt)}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="w-3 h-3 text-zinc-400" />
        <span className="truncate" title={listing.address.formattedAddress}>
          {listing.address.formattedAddress}
        </span>
      </div>
    </div>
  );
}
