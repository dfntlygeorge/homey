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
import { deleteListingAction } from "@/app/_actions/manage/delete-listing";
import { toast } from "sonner";
import { routes } from "@/config/routes";
import { updateListingAvailabilityAction } from "@/app/_actions/manage/update-listing-availability";
import { cn } from "@/lib/utils";
import { archiveListingAction } from "@/app/_actions/manage/archive-listing";
import { Prisma } from "@prisma/client";
import { ManageReservationsButton } from "./manage-reservations-button";
import { unarchiveListingAction } from "@/app/_actions/manage/unarhive-listing";

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
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAvailableToggle = () => {
    startTransition(async () => {
      try {
        const response = await updateListingAvailabilityAction(
          listing.id,
          !isAvailable
        );

        if (response.success) {
          setIsAvailable(!isAvailable);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Something went wrong while updating availability.");
      }
    });
  };

  const handleArchiveToggle = async () => {
    if (isArchiving) return; // Prevent multiple clicks

    setIsArchiving(true);
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsArchiving(false);
    }
  };

  const handleDeleteListing = async () => {
    if (isDeleting) return; // Prevent multiple clicks

    setIsDeleting(true);
    try {
      const response = await deleteListingAction(listing.id);

      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Something went wrong while deleting the listing.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareListing = () => {
    // Add share functionality here
    if (navigator.share) {
      navigator
        .share({
          title: listing.title || "Check out this listing",
          url: `${window.location.origin}${routes.listing(listing.id)}`,
        })
        .catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `${window.location.origin}${routes.listing(listing.id)}`
      );
      toast.success("Link copied to clipboard!");
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
          disabled={isArchiving}
        >
          {isArchiving ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Unarchiving...
            </>
          ) : (
            <>
              <ArchiveRestore className="w-3 h-3 mr-1" />
              Unarchive Listing
            </>
          )}
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
          disabled={isPending}
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
        onClick={handleShareListing}
      >
        <Share className="w-3 h-3" />
        <span className="sr-only">Share</span>
      </Button>

      {/* Manage Reservation Button */}
      <ManageReservationsButton listing={listing} />

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            <MoreHorizontal className="w-3 h-3" />
            <span className="sr-only">More actions</span>
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

          {!isArchived && (
            <DropdownMenuItem asChild>
              <Link href={routes.editListing(listing.id)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Listing
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Archive/Unarchive Toggle */}
          <DropdownMenuItem
            onClick={handleArchiveToggle}
            className="cursor-pointer"
            disabled={isArchiving}
          >
            {isArchiving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isArchived ? "Unarchiving..." : "Archiving..."}
              </>
            ) : isArchived ? (
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

          <DropdownMenuItem className="text-red-600" disabled={isDeleting}>
            <button
              className="flex items-center cursor-pointer w-full disabled:cursor-not-allowed"
              onClick={handleDeleteListing}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Listing
                </>
              )}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
