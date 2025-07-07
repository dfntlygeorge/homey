import { ManageListingCard } from "@/components/manage/manage-listing-card";
import { ListingWithImages } from "@/config/types";

interface ManageListingsGridProps {
  listings: ListingWithImages[]; // Replace with your actual listing type
  isViewingArchived: boolean;
}

export function ManageListingsGrid({
  listings,
  isViewingArchived,
}: ManageListingsGridProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {listings.map((listing, index) => (
        <div
          key={listing.id}
          className="animate-in fade-in-0 slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ManageListingCard listing={listing} isArchived={isViewingArchived} />
        </div>
      ))}
    </div>
  );
}
