"use client";

import { ListingWithImagesAndAddress } from "@/config/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/config/routes";
import { MapPin, BadgeDollarSign, Bed, Users, Eye } from "lucide-react";
import { formatEnumValue, formatPrice } from "@/lib/utils";

interface UserListingCardProps {
  listing: ListingWithImagesAndAddress;
}

export const UserListingCard = ({ listing }: UserListingCardProps) => {
  const {
    id,
    title,
    images,
    address,
    rent,
    roomType,
    slotsAvailable,
    viewCount,
  } = listing;

  return (
    <div className="flex bg-background border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 h-32">
      {/* Image Section */}
      <div className="relative w-32 flex-shrink-0">
        <Link href={routes.listing(id)} className="block h-full">
          <Image
            src={images?.[0]?.url || "/placeholder-property.jpg"}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
        <div className="space-y-2">
          {/* Title */}
          <Link href={routes.listing(id)} className="block">
            <h3 className="font-semibold text-sm line-clamp-1 hover:underline text-foreground">
              {title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="line-clamp-1">{address.formattedAddress}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
              <BadgeDollarSign className="w-3 h-3 mr-1" />
              {formatPrice(rent)}
            </Badge>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              <Bed className="w-3 h-3 mr-1" />
              {formatEnumValue(roomType)}
            </Badge>
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
              <Users className="w-3 h-3 mr-1" />
              {slotsAvailable}
            </Badge>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span>{viewCount || 0} views</span>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-xs h-7 px-2"
            asChild
          >
            <Link href={routes.listing(id)}>View</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
