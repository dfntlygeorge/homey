"use client";

import { UserProfileHeader } from "./user-profile-header";
import { UserListings } from "./user-listings";
import { Prisma } from "@prisma/client";

interface UserProfileViewProps {
  user: Prisma.UserGetPayload<{
    include: {
      listings: {
        include: {
          images: true;
          address: {
            include: {
              reviews: true;
            };
          };
        };
      };
    };
  }> & {
    _count: {
      listings: number;
    };
  };
  totalReviews: number;
  averageRating: number;
}

export const UserProfileView = ({
  user,
  totalReviews,
  averageRating,
}: UserProfileViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info (Desktop) / Top Section (Mobile) */}
          <div className="lg:col-span-1">
            <UserProfileHeader
              user={user}
              avgRating={averageRating}
              totalReviews={totalReviews}
            />
          </div>

          {/* Right Column - Listings (Full Width) */}
          <div className="lg:col-span-2">
            <UserListings listings={user.listings} />
          </div>
        </div>
      </div>
    </div>
  );
};
