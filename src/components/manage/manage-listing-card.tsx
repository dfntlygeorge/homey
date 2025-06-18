"use client";

import {
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Share,
  RotateCcw,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { ListingWithImages } from "@/config/types";
import { useState } from "react";
import { deleteListingAction } from "@/app/_actions/delete-listing";
import { toast } from "sonner";
import { routes } from "@/config/routes";

export function ManageListingCard({ listing }: { listing: ListingWithImages }) {
  const [isAvailable, setIsAvailable] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="py-1 px-3">
        {/* Top Section: Image and Details */}
        <div className="flex gap-3 mb-3">
          {/* Image Section */}
          <div className="relative w-20 h-20 bg-zinc-200 flex-shrink-0 rounded-md overflow-hidden">
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
              <h3 className="text-base font-semibold text-zinc-900 truncate">
                {listing.title}
              </h3>
              {/* Status Badge */}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  listing.status
                )} ml-2 flex-shrink-0`}
              >
                {listing.status}
              </span>
            </div>

            <p className="text-lg font-bold text-zinc-900 mb-1">
              ₱{listing.rent.toLocaleString()}
            </p>

            <p className="text-xs text-zinc-600 mb-1">Listed to Marketplace</p>

            <p className="text-xs text-zinc-500">2 views (14 days)</p>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex gap-2">
          {/* Toggle Available/Unavailable - More compact */}
          <Button
            variant={isAvailable ? "default" : "outline"}
            onClick={() => setIsAvailable(!isAvailable)}
            size="sm"
            className="flex-1"
          >
            {isAvailable ? (
              <>
                <Pause className="w-3 h-3 mr-1" />
                Unavailable
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Available
              </>
            )}
          </Button>

          {/* Share Button */}
          <Button variant="outline" size="sm" className="px-3">
            <Share className="w-3 h-3" /> Share
          </Button>

          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-2">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <RotateCcw className="w-4 h-4 mr-2" />
                Renew Post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pause className="w-4 h-4 mr-2" />
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/listings/${listing.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={routes.editListing(listing.id)}
                  className="flex items-center cursor-pointer w-full"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Listing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600 ">
                <button
                  className="flex items-center cursor-pointer w-full"
                  onClick={async () => {
                    const response = await deleteListingAction(listing.id);

                    if (response.success) {
                      toast.success(response.message);
                    } else {
                      toast.error(response.message);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Listing
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
