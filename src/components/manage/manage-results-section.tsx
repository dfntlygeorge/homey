import { ManageResultsHeader } from "./manage-results-header";
import { ManageNoResults } from "./manage-no-results";
import { ManageListingsGrid } from "./manage-listings-grid";
import { Prisma } from "@prisma/client";

interface ManageResultsSectionProps {
  listings: Prisma.ListingGetPayload<{
    include: {
      reservations: {
        include: {
          user: true;
        };
      };
      images: true;
    };
  }>[]; // Replace with your actual listing type
  isViewingArchived: boolean;
  hasFilters: boolean;
}

export function ManageResultsSection({
  listings,
  isViewingArchived,
  hasFilters,
}: ManageResultsSectionProps) {
  return (
    <div className="space-y-6">
      <ManageResultsHeader
        isViewingArchived={isViewingArchived}
        listingsCount={listings.length}
        hasFilters={hasFilters}
      />

      {listings.length === 0 ? (
        <ManageNoResults
          isViewingArchived={isViewingArchived}
          hasFilters={hasFilters}
        />
      ) : (
        <ManageListingsGrid
          listings={listings}
          isViewingArchived={isViewingArchived}
        />
      )}
    </div>
  );
}
