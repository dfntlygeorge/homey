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
  Loader2,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { ListingWithImages } from "@/config/types";
import { useState, useTransition } from "react";
import { deleteListingAction } from "@/app/_actions/delete-listing";
import { toast } from "sonner";
import { routes } from "@/config/routes";
import { updateListingAvailabilityAction } from "@/app/_actions/update-listing-availability";
import { cn } from "@/lib/utils";
import { archiveListingAction } from "@/app/_actions/archive-listing";
import { unarchiveListingAction } from "@/app/_actions/unarhive-listing"; // You'll need to create this action

interface ManageListingCardProps {
  listing: ListingWithImages;
  isArchived?: boolean;
}

export function ManageListingCard({
  listing,
  isArchived = false,
}: ManageListingCardProps) {
  const [isAvailable, setIsAvailable] = useState(listing.isAvailable);
  const [isPending, startTransition] = useTransition();

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

  const handleAvailableToggle = () => {
    startTransition(async () => {
      try {
        await updateListingAvailabilityAction(listing.id, !isAvailable);
        setIsAvailable(!isAvailable);
        toast.success(
          `Listing marked as ${!isAvailable ? "available" : "unavailable"}`
        );
      } catch (error) {
        console.error("Error updating availability: ", error);
        toast.error("Something went wrong while updating availability.");
      }
    });
  };

  const handleArchiveToggle = async () => {
    try {
      if (isArchived) {
        const response = await unarchiveListingAction(listing.id);
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await archiveListingAction(listing.id);
        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
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

        {/* Top Section: Image and Details */}
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
                  `px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    listing.status
                  )} ml-2 flex-shrink-0`,
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

        {/* Action Buttons Section */}
        <div className="flex gap-2">
          {/* Primary Action Button - Changes based on archive status */}
          {isArchived ? (
            <Button
              variant="default"
              onClick={handleArchiveToggle}
              size="sm"
              className="flex-1"
            >
              <ArchiveRestore className="w-3 h-3 mr-1" />
              Unarchive Listing
            </Button>
          ) : (
            <Button
              variant={isAvailable ? "default" : "outline"}
              onClick={handleAvailableToggle}
              size="sm"
              className={cn(
                "flex-1 relative",
                isPending ? "cursor-not-allowed" : "cursor-pointer"
              )}
            >
              {isAvailable ? (
                <>
                  <Pause className="w-3 h-3 mr-1" />
                  Mark as unavailable
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Mark as available
                </>
              )}
              {isPending && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </Button>
          )}

          {/* Share Button - Disabled for archived listings */}
          <Button
            variant="outline"
            size="sm"
            className="px-3"
            disabled={isArchived}
          >
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
              {!isArchived && (
                <>
                  <DropdownMenuItem>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Renew Post
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pause className="w-4 h-4 mr-2" />
                    Mark as Pending
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuItem asChild>
                <Link href={routes.listing(listing.id)}>
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

              <DropdownMenuSeparator />

              {/* Archive/Unarchive Toggle */}
              <DropdownMenuItem
                onClick={handleArchiveToggle}
                className="cursor-pointer"
              >
                {isArchived ? (
                  <>
                    <ArchiveRestore className="w-4 h-4 mr-2" />
                    Unarchive Listing
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive Listing
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="text-red-600">
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
