"use client";
import { updateListingStatus } from "@/app/_actions/update-listing-status";
import { Listing, ListingStatus } from "@prisma/client";

export const AdminActionButtons = ({ listing }: { listing: Listing }) => {
  return (
    <>
      <button
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
        onClick={() => updateListingStatus(listing.id, ListingStatus.APPROVED)}
      >
        Approve
      </button>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
        onClick={() => updateListingStatus(listing.id, ListingStatus.REJECTED)}
      >
        Reject
      </button>
    </>
  );
};
