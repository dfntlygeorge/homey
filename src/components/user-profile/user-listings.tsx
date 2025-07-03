import { ListingWithImages } from "@/config/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserListingCard } from "./user-listing-card";

interface UserListingsProps {
  listings: ListingWithImages[];
}

export const UserListings = ({ listings }: UserListingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {listings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No listings available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <UserListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
