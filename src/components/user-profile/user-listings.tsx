import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserListingCard } from "./user-listing-card";
import { Prisma } from "@prisma/client";
import { Home } from "lucide-react";

interface UserListingsProps {
  listings: Prisma.ListingGetPayload<{
    include: {
      images: true;
      address: {
        include: {
          reviews: true;
        };
      };
    };
  }>[];
}

export const UserListings = ({ listings }: UserListingsProps) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Home className="w-5 h-5" />
          Listings ({listings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {listings.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  No listings yet
                </p>
                <p className="text-xs text-muted-foreground">
                  This user hasn&apos;t posted any listings yet
                </p>
              </div>
            </div>
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
