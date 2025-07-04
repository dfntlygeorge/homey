import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Calendar, CheckCircle } from "lucide-react";
import { HATDOG } from "@/config/types";
import { StarRating } from "./star-rating";
import { ContactSection } from "./contact-section";
import { UserStats } from "./user-stats";

interface UserProfileHeaderProps {
  user: HATDOG & {
    _count: {
      listings: number;
    };
  };
  avgRating: number;
  totalReviews: number;
}

export const UserProfileHeader = ({
  user,
  avgRating,
  totalReviews,
}: UserProfileHeaderProps) => {
  const joinDate = user.createdAt
    ? formatDistanceToNow(user.createdAt, { addSuffix: true })
    : "Recently";

  // Calculate total views from all listings
  const totalViews = user.listings.reduce(
    (sum, listing) => sum + (listing.viewCount || 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Main Profile Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-muted border-4 border-background shadow-lg">
                <Image
                  src={user.image || "/placeholder-avatar.jpg"}
                  alt={user.name || "User"}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center space-y-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {user.name || "Anonymous User"}
                </h1>
                {/* TODO: Replace with actual isVerified field */}
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Verified User
                </Badge>
              </div>

              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined {joinDate}</span>
              </div>

              {/* Overall Rating - only show if user has listings with reviews */}
              {totalReviews > 0 && user.listings.length > 0 && (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center gap-2">
                    <StarRating rating={avgRating} />
                    <span className="text-sm text-muted-foreground">
                      {avgRating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {totalReviews} review
                    {totalReviews !== 1 ? "s" : ""} across all listings
                  </p>
                </div>
              )}
            </div>

            {/* Contact Section */}
            <div className="w-full">
              <ContactSection user={user} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <UserStats
        listingCount={user._count.listings}
        reviewCount={totalReviews}
        totalViews={totalViews}
      />
    </div>
  );
};
