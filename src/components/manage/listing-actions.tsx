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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteListingAction } from "@/app/_actions/delete-listing";
import { toast } from "sonner";
import { routes } from "@/config/routes";
import { updateListingAvailabilityAction } from "@/app/_actions/update-listing-availability";
import { cn } from "@/lib/utils";
import { archiveListingAction } from "@/app/_actions/archive-listing";
import { unarchiveListingAction } from "@/app/_actions/unarhive-listing";
import { Prisma } from "@prisma/client";
import { ManageReservationsButton } from "./manage-reservations-button";

interface ListingActionsProps {
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
  onArchiveToggle?: () => void;
}

export function ListingActions({
  listing,
  isArchived = false,
  onArchiveToggle,
}: ListingActionsProps) {
  const [isAvailable, setIsAvailable] = useState(listing.isAvailable);
  const [isPending, startTransition] = useTransition();

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
          onArchiveToggle?.();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await archiveListingAction(listing.id);
        if (response.success) {
          toast.success(response.message);
          onArchiveToggle?.();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteListing = async () => {
    const response = await deleteListingAction(listing.id);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };
  return (
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

      {/* Manage Reservation Button */}
      <ManageReservationsButton listing={listing} />

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
              onClick={handleDeleteListing}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Listing
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
