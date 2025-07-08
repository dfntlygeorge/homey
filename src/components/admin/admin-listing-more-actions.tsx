"use client";

import { MoreHorizontal, Eye, User, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { updateListingStatus } from "@/app/_actions/update-listing-status";
import { createNotificationAction } from "@/app/_actions/notification";
import { ListingStatus, NotificationType } from "@prisma/client";
import {
  ListingWithImagesUserAndReports,
  ListingWithAddress,
} from "@/config/types";

interface AdminListingMoreActionsProps {
  listing: ListingWithImagesUserAndReports & ListingWithAddress;
}

export function AdminListingMoreActions({
  listing,
}: AdminListingMoreActionsProps) {
  const handleResetToPending = async () => {
    try {
      await updateListingStatus(listing.id, ListingStatus.PENDING);
      await createNotificationAction(
        listing.user.id,
        `Your listing '${listing.title}' has been marked as pending.`,
        NotificationType.LISTING,
        listing.id
      );
      toast.success("Status reset to pending");
    } catch (error) {
      console.error("Error resetting status:", error);
      toast.error("Failed to reset status");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link href={`/listings/${listing.id}`} className="cursor-pointer">
            <Eye className="w-4 h-4 mr-2" />
            View Full Listing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={`/admin/users/${listing.user.id}`}
            className="cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            View Landlord Profile
          </Link>
        </DropdownMenuItem>

        {listing.reports && listing.reports.length > 0 && (
          <DropdownMenuItem asChild>
            <Link
              href={`/admin/listings/${listing.id}/reports`}
              className="cursor-pointer"
            >
              <Shield className="w-4 h-4 mr-2" />
              Manage Reports ({listing.reports.length})
            </Link>
          </DropdownMenuItem>
        )}

        {listing.status !== "PENDING" && (
          <DropdownMenuItem
            onClick={handleResetToPending}
            className="cursor-pointer"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Reset to Pending
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
