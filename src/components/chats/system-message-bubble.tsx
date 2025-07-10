"use client";

import { useState } from "react";
import { Star, MessageSquare, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitReviewAction } from "@/app/_actions/chats/create-review";
import { SystemMessage } from "./chat-window";

interface SystemMessageBubbleProps {
  systemMessage: SystemMessage;
  onReviewSubmitted: (reviewData: { rating: number; comment: string }) => void;
  onDismiss: () => void;
}

export const SystemMessageBubble = ({
  systemMessage,
  onReviewSubmitted,
  onDismiss,
}: SystemMessageBubbleProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating before submitting your review.");
      return;
    }

    if (comment.trim().length === 0) {
      toast.error("Please write a comment about your experience.");
      return;
    }

    if (!systemMessage.data.addressId) {
      toast.error("Unable to submit review. Address information is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitReviewAction(
        systemMessage.data.addressId,
        rating,
        comment,
        isAnonymous
      );

      if (result.success) {
        toast.success("Review submitted successfully!");
        setOpen(false);

        // Notify parent component about successful submission
        onReviewSubmitted({ rating, comment });

        // Reset form
        setRating(0);
        setComment("");
        setHoveredRating(0);
      } else {
        toast.error(result.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleRatingHover = (value: number) => {
    setHoveredRating(value);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  // Render review submitted message
  if (
    systemMessage.type === "review_submitted" &&
    systemMessage.data.existingReview
  ) {
    return (
      <div className="flex justify-center mb-4">
        <div className="max-w-md w-full">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-green-800 text-sm">
                      Review Submitted
                    </h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`w-3 h-3 ${
                            value <= systemMessage.data.existingReview!.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-green-700">
                    Thank you for reviewing {systemMessage.data.listingTitle}!
                    Your feedback helps other students.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render review prompt message
  return (
    <div className="flex justify-center mb-4">
      <div className="max-w-md w-full">
        <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-blue-800 text-sm">
                      System Message
                    </h4>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      Review Request
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="space-y-3">
                      <p className="text-sm text-blue-700">
                        How was your stay at{" "}
                        <strong>{systemMessage.data.listingTitle}</strong>? Your
                        review helps other students make informed decisions.
                      </p>
                      <div className="flex gap-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Leave a Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Write a Review</DialogTitle>
                              <DialogDescription>
                                Share your experience to help other students.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <div className="flex items-center space-x-1">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                      key={value}
                                      type="button"
                                      onClick={() => handleRatingClick(value)}
                                      onMouseEnter={() =>
                                        handleRatingHover(value)
                                      }
                                      onMouseLeave={handleRatingLeave}
                                      className="p-1 rounded-sm hover:bg-muted/50 transition-colors"
                                    >
                                      <Star
                                        className={`w-6 h-6 transition-colors ${
                                          value <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    {rating > 0 && (
                                      <>
                                        {rating} star{rating !== 1 ? "s" : ""}
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="comment">Your Experience</Label>
                                <Textarea
                                  id="comment"
                                  placeholder="Tell us about your stay. What did you like? What could be improved?"
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  rows={4}
                                  className="resize-none"
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="anonymous"
                                  checked={isAnonymous}
                                  onChange={(e) =>
                                    setIsAnonymous(e.target.checked)
                                  }
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label
                                  htmlFor="anonymous"
                                  className="text-sm cursor-pointer relative group"
                                  title="Your name and profile information will not be shown with this review"
                                >
                                  Submit anonymously
                                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Your name and profile won&apos;t be shown
                                  </span>
                                </Label>
                              </div>

                              <div className="flex justify-end space-x-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setOpen(false)}
                                  disabled={isSubmitting}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                  {isSubmitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsCollapsed(true)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                        >
                          {isCollapsed ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4" />
                          )}
                          {isCollapsed ? "Show" : "Collapse"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(false)}
                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
