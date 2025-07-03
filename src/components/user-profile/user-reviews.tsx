import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ReviewWithListingTitle } from "@/config/types";
import { StarRating } from "./star-rating";

interface UserReviewsProps {
  reviews: ReviewWithListingTitle[];
}

export const UserReviews = ({ reviews }: UserReviewsProps) => {
  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Reviews</CardTitle>
        <div className="flex items-center gap-2">
          <StarRating rating={avgRating} />
          <span className="text-sm text-muted-foreground">
            {avgRating.toFixed(1)} • {reviews.length} reviews
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {/* TODO: Seed review data */}
            No reviews yet
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-border pb-4 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <StarRating rating={review.rating} size="sm" />
                    <p className="text-sm text-muted-foreground mt-1">
                      Review for &quot;{review.listing.title}&quot;
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
