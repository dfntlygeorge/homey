"use client";

import {
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Share,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        setShowDeleteDialog(false);
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

  const handleDeleteClick = () => {
    setDropdownOpen(false); // Close dropdown first
    setTimeout(() => {
      setShowDeleteDialog(true); // Then open dialog
    }, 100);
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
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="px-2">
            <MoreHorizontal className="w-3 h-3" />
            <span className="sr-only">More actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
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

          {/* Delete Button - Now properly handled */}
          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600 cursor-pointer"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Listing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog - Now separate from dropdown */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this listing? <br />
            <strong>
              All conversations, reservations and related data will also be
              deleted.
            </strong>
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteListing}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
