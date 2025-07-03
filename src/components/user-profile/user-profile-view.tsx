"use client";

import { UserWithListingsAndReviews } from "@/config/types";
import { UserProfileHeader } from "./user-profile-header";
import { UserListings } from "./user-listings";
import { UserReviews } from "./user-reviews";

interface UserProfileViewProps {
  user: UserWithListingsAndReviews & {
    _count: {
      listings: number;
      reviews: number;
    };
  };
}
export const UserProfileView = ({ user }: UserProfileViewProps) => {
  const avgRating =
    user.reviews.length > 0
      ? user.reviews.reduce((sum, review) => sum + review.rating, 0) /
        user.reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info (Desktop) / Top Section (Mobile) */}
          <div className="lg:col-span-1">
            <UserProfileHeader
              user={user}
              avgRating={avgRating}
              totalReviews={user.reviews.length}
            />
          </div>

          {/* Right Column - Listings & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <UserListings listings={user.listings} />
            <UserReviews reviews={user.reviews} />
          </div>
        </div>
      </div>
    </div>
  );
};
