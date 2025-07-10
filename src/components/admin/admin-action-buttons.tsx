"use client";

import { updateListingStatus } from "@/app/_actions/admin/update-listing-status";
import { Listing, ListingStatus } from "@prisma/client";
import { toast } from "sonner";

export const AdminActionButtons = ({ listing }: { listing: Listing }) => {
  const handleApprove = async () => {
    try {
      const res = await updateListingStatus(listing.id, ListingStatus.APPROVED);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An unexpected error occurred while approving the listing.");
    }
  };

  const handleReject = async () => {
    try {
      const res = await updateListingStatus(listing.id, ListingStatus.REJECTED);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An unexpected error occurred while rejecting the listing.");
    }
  };

  return (
    <>
      <button
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
        onClick={handleApprove}
      >
        Approve
      </button>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        onClick={handleReject}
      >
        Reject
      </button>
    </>
  );
};
