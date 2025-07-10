"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateListingStatus } from "@/app/_actions/admin/update-listing-status";
import { createNotificationAction } from "@/app/_actions/shared/notification";
import { ListingStatus, NotificationType } from "@prisma/client";
import {
  ListingWithImagesUserAndReports,
  ListingWithAddress,
} from "@/config/types";

interface AdminListingActionButtonsProps {
  listing: ListingWithImagesUserAndReports & ListingWithAddress;
}

export function AdminListingActionButtons({
  listing,
}: AdminListingActionButtonsProps) {
  const [isPending, setIsPending] = useState(false);

  const handleApprove = async () => {
    setIsPending(true);
    try {
      await updateListingStatus(listing.id, ListingStatus.APPROVED);
      await createNotificationAction(
        listing.user.id,
        `Your listing '${listing.title}' has been approved.`,
        NotificationType.LISTING,
        listing.id
      );
      toast.success("Listing approved successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to approve listing");
    } finally {
      setIsPending(false);
    }
  };

  const handleReject = async () => {
    setIsPending(true);
    try {
      await updateListingStatus(listing.id, ListingStatus.REJECTED);
      await createNotificationAction(
        listing.user.id,
        `Your listing '${listing.title}' has been rejected.`,
        NotificationType.LISTING,
        listing.id
      );
      toast.success("Listing rejected");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to reject listing");
    } finally {
      setIsPending(false);
    }
  };

  if (listing.status !== "PENDING") {
    return null;
  }

  return (
    <div className="flex gap-2  ">
      <Button
        onClick={handleApprove}
        disabled={isPending}
        size="sm"
        className="flex-1 bg-green-600 hover:bg-green-700 transition-colors"
      >
        <Check className="w-4 h-4 mr-2" />
        {isPending ? "Approving..." : "Approve"}
      </Button>
      <Button
        onClick={handleReject}
        disabled={isPending}
        variant="destructive"
        size="sm"
        className="flex-1 transition-colors"
      >
        <X className="w-4 h-4 mr-2" />
        {isPending ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
}
