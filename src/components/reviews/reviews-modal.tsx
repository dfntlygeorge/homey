"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewWithUser } from "@/config/types";

interface ReviewsModalProps {
  reviews: ReviewWithUser[];
  averageRating: number;
}

const REVIEWS_PER_PAGE = 5;

const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
  const stars = [];
  const starSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  for (let i = 0; i < 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        className={`${starSize} ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    );
  }

  return stars;
};

const getInitials = (name: string | null, email: string | null) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return "U";
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const ReviewsModal = ({ reviews, averageRating }: ReviewsModalProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [sortedReviews, setSortedReviews] = useState<ReviewWithUser[]>(reviews);

  // TODO: Implement sorting logic
  useEffect(() => {
    const sorted = [...reviews];

    switch (sortBy) {
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      default:
        // Keep original order
        break;
    }

    setSortedReviews(sorted);
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [sortBy, reviews]);

  const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = sortedReviews.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((review) => review.rating === rating).length /
            reviews.length) *
          100
        : 0,
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm font-medium">
          See all reviews
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Reviews & Ratings
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Rating Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {renderStars(Math.round(averageRating), "md")}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"}
                  </div>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2 text-sm">
                    <span className="w-8 text-gray-600">{rating}</span>
                    <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-gray-600 text-right">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sort and Filters */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest rated</SelectItem>
                  <SelectItem value="lowest">Lowest rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Reviews List */}
          <div className="space-y-6">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-6 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        review.isAnonymous
                          ? undefined
                          : review.user.image || undefined
                      }
                    />
                    <AvatarFallback>
                      {review.isAnonymous
                        ? "A"
                        : getInitials(review.user.name, review.user.email)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 relative group">
                        {review.isAnonymous
                          ? "Anonymous User"
                          : review.user.name || "Anonymous User"}
                        {review.isAnonymous && (
                          <span className="absolute -top-8 left-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                            Verified guest - stayed here
                          </span>
                        )}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(review.createdAt)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(review.rating)}
                      <span className="text-sm font-medium text-gray-700 ml-2">
                        {review.rating}/5
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* No Reviews State */}
          {reviews.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <StarIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600">
                Be the first to review this place!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
