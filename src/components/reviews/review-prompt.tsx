"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
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
import { submitReviewAction } from "@/app/_actions/create-review";

interface ReviewPromptProps {
  addressId: number;
}

export function ReviewPrompt({ addressId }: ReviewPromptProps) {
  // TODO: use zod and react hook form
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      const result = await submitReviewAction(addressId, rating, comment);

      if (result.success) {
        toast.success("Review submitted successfully!");

        setOpen(false);
        setRating(0);
        setComment("");
        setHoveredRating(0);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log("ERROR IN SUBMITTING THE REVIEW: ", error);
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

  return (
    <div className="bg-card border rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Did you stay here?</h3>
          </div>
          <div className="mt-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
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
                          onMouseEnter={() => handleRatingHover(value)}
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
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
